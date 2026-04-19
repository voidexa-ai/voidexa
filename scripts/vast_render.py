"""Vast.ai API orchestration pipeline for voidexa.

Implements docs/VOIDEXA_VAST_AI_RENDER_MASTER.md Parts 6, 8, 10, 11, 12.

Usage:
    python scripts/vast_render.py --source {shop|cards|both} --test N [--gpu H100_SXM] [--dry-run] [--yes]

This is a BUILD-sprint scaffold — every phase logs the action it would take.
With --dry-run no network or API calls are made. Without --dry-run, the script
still requires credentials and will exit cleanly with an error if any are
missing. See the master doc for the production wiring checklist.
"""

from __future__ import annotations

import argparse
import json
import os
import pathlib
import random
import shlex
import sys
import time
import uuid
from collections import Counter
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any, Iterable

import yaml
from dotenv import load_dotenv

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "scripts" / "render_config.yaml"
WORKFLOW_PATH = ROOT / "scripts" / "voidexa_sdxl_workflow.json"

# ---------------------------------------------------------------------------
# Config + env loading
# ---------------------------------------------------------------------------


def load_env() -> None:
    env_file = ROOT / ".env.local"
    if env_file.exists():
        load_dotenv(env_file)
    # Accept the standard Next.js naming for the URL (service-role key is
    # always server-only so it keeps its un-prefixed name).
    if not os.environ.get("SUPABASE_URL") and os.environ.get("NEXT_PUBLIC_SUPABASE_URL"):
        os.environ["SUPABASE_URL"] = os.environ["NEXT_PUBLIC_SUPABASE_URL"]


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def load_workflow() -> dict:
    with open(WORKFLOW_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


# ---------------------------------------------------------------------------
# Logging helpers
# ---------------------------------------------------------------------------


def _stamp() -> str:
    return datetime.now().strftime("%H:%M:%S")


def log(msg: str) -> None:
    print(f"[{_stamp()}] {msg}")


def banner(title: str) -> None:
    bar = "=" * max(8, len(title) + 4)
    print(bar)
    print(f"  {title}")
    print(bar)


# ---------------------------------------------------------------------------
# State for resumability — Part 10
# ---------------------------------------------------------------------------


@dataclass
class RenderState:
    source: str
    started_at: str
    completed: list[str] = field(default_factory=list)
    failed: list[dict] = field(default_factory=list)
    current_instance_id: int | None = None
    spent_usd: float = 0.0
    duration_seconds: float = 0.0

    @classmethod
    def load(cls, path: pathlib.Path, source: str) -> "RenderState":
        if path.exists():
            try:
                raw = json.loads(path.read_text(encoding="utf-8"))
                if raw.get("source") == source:
                    return cls(**{k: raw.get(k) for k in cls.__dataclass_fields__})
            except Exception as exc:
                log(f"WARN: failed to read state {path}: {exc}. Starting fresh.")
        return cls(source=source, started_at=datetime.now(timezone.utc).isoformat())

    def save(self, path: pathlib.Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(asdict(self), indent=2), encoding="utf-8")


# ---------------------------------------------------------------------------
# Prompt source loading
# ---------------------------------------------------------------------------


def load_prompts(config: dict, source: str) -> list[dict]:
    spec = config["sources"][source]
    path = ROOT / spec["prompts_path"]
    if not path.exists():
        raise FileNotFoundError(f"{source} prompts file missing: {path}")
    raw = json.loads(path.read_text(encoding="utf-8"))
    prompts = raw["prompts"] if isinstance(raw, dict) and "prompts" in raw else raw
    if not isinstance(prompts, list) or not prompts:
        raise ValueError(f"{source} prompts file has no prompts array")
    id_field = spec["id_field"]
    for p in prompts:
        if id_field not in p:
            raise ValueError(f"{source} prompt missing {id_field}: {p.keys()}")
    return prompts


def pick_test_batch(
    prompts: list[dict],
    source: str,
    n: int,
    config: dict,
    seed: int = 20260419,
) -> list[dict]:
    """Stratified selection per Part 8."""
    rng = random.Random(seed)
    if n <= 0 or n >= len(prompts):
        return list(prompts)

    test_spec = config.get("test_batch", {}).get(source, {})
    rarity_counts = test_spec.get("rarity_counts", {})
    must_types = test_spec.get("must_include_types", [])

    by_rarity: dict[str, list[dict]] = {}
    for p in prompts:
        by_rarity.setdefault(p.get("rarity", "common"), []).append(p)

    selected: list[dict] = []

    # Always include the mandated Part-8 card types first (for cards source).
    if must_types:
        for t in must_types:
            cand = [p for p in prompts if p.get("type") == t]
            if cand:
                pick = rng.choice(cand)
                if pick not in selected:
                    selected.append(pick)

    # Then fill per-rarity quotas.
    for rarity, want in rarity_counts.items():
        pool = by_rarity.get(rarity, [])
        rng.shuffle(pool)
        taken = 0
        for p in pool:
            if p in selected:
                continue
            if taken >= want:
                break
            selected.append(p)
            taken += 1

    # Truncate or pad to n.
    selected = selected[:n]
    if len(selected) < n:
        leftover = [p for p in prompts if p not in selected]
        rng.shuffle(leftover)
        selected.extend(leftover[: n - len(selected)])
    return selected


# ---------------------------------------------------------------------------
# Cost estimation — Part 5, 12
# ---------------------------------------------------------------------------


def estimate_cost(prompts: list[dict], gpu_profile: dict, config: dict) -> dict:
    """Rough estimate — SDXL @ ~2 s/image on H100, 4 s on 4090, 7 s on 3090."""
    per_image_seconds = {
        "H100_SXM": 2.0,
        "H100": 2.2,
        "RTX_4090": 4.0,
        "RTX_3090": 7.0,
    }.get(gpu_profile.get("gpu_name", ""), 3.0)

    # mythics get 2x render time per prompt flag
    total_sec = 0.0
    for p in prompts:
        mult = p.get("estimated_render_time") or (2 if p.get("rarity") == "mythic" else 1)
        total_sec += per_image_seconds * mult

    setup_sec = 480.0   # 8 min model download on first run
    buffer_sec = 60.0   # small safety buffer
    total_hours = (total_sec + setup_sec + buffer_sec) / 3600.0
    est_cost = total_hours * gpu_profile.get("max_price_per_hour", 3.0)
    return {
        "prompts": len(prompts),
        "per_image_seconds": per_image_seconds,
        "total_render_minutes": round(total_sec / 60.0, 1),
        "setup_minutes": round(setup_sec / 60.0, 1),
        "total_hours": round(total_hours, 3),
        "estimated_cost_usd": round(est_cost, 2),
        "rate_per_hour": gpu_profile.get("max_price_per_hour"),
    }


# ---------------------------------------------------------------------------
# Phase runners — each honors dry_run
# ---------------------------------------------------------------------------


@dataclass
class Orchestrator:
    source: str
    test_n: int
    gpu_key: str
    dry_run: bool
    auto_yes: bool
    config: dict = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not self.config:
            self.config = load_config()
        self.workflow = load_workflow()
        self.gpu_profile = self.config["gpu_profiles"][self.gpu_key]
        self.state_path = ROOT / self.config["state"]["path"]
        self.client_id = f"voidexa-{uuid.uuid4().hex[:12]}"
        self._comfy_base_url: str | None = None
        self._image_tmp_dir = ROOT / "scripts" / ".voidexa_render_cache"

    # ---------------- Phase 1: pre-flight ----------------

    def preflight(self) -> dict:
        banner("Phase 1 — pre-flight checks")
        checks: list[tuple[str, bool, str]] = []

        vast_key = os.environ.get("VAST_API_KEY", "")
        checks.append(("VAST_API_KEY in env", bool(vast_key) or self.dry_run, "required unless --dry-run"))

        supa_url = os.environ.get("SUPABASE_URL", "")
        supa_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        checks.append(("SUPABASE_URL", bool(supa_url) or self.dry_run, ""))
        checks.append(("SUPABASE_SERVICE_ROLE_KEY", bool(supa_key) or self.dry_run, ""))

        # Prompt sources
        sources = ["shop", "cards"] if self.source == "both" else [self.source]
        all_prompts: dict[str, list[dict]] = {}
        for src in sources:
            prompts = load_prompts(self.config, src)
            checks.append((f"{src} prompts loaded", True, f"{len(prompts)} prompts"))
            all_prompts[src] = prompts

        # Workflow JSON parseable
        checks.append(("workflow JSON parseable", isinstance(self.workflow, dict) and len(self.workflow) >= 6, f"{len(self.workflow)} nodes"))

        ok = all(passed for _, passed, _ in checks)
        for name, passed, note in checks:
            marker = "OK " if passed else "FAIL"
            extra = f" — {note}" if note else ""
            log(f"  [{marker}] {name}{extra}")

        if not ok:
            raise RuntimeError("pre-flight failed")

        # Build the actual render set (test stratified or full)
        selected: list[tuple[str, dict]] = []
        for src, prompts in all_prompts.items():
            batch = pick_test_batch(prompts, src, self.test_n, self.config) if self.test_n > 0 else prompts
            for p in batch:
                selected.append((src, p))

        # Cost estimate
        flat = [p for _, p in selected]
        cost = estimate_cost(flat, self.gpu_profile, self.config)
        log(
            f"  Batch size: {cost['prompts']}  |  GPU: {self.gpu_key} "
            f"(<= ${self.gpu_profile['max_price_per_hour']}/hr)  |  est cost ${cost['estimated_cost_usd']}"
        )
        log(f"  Render minutes ~{cost['total_render_minutes']} + setup ~{cost['setup_minutes']}")

        max_budget = float(self.config["limits"]["max_budget_usd"])
        if cost["estimated_cost_usd"] > max_budget:
            raise RuntimeError(
                f"estimated cost ${cost['estimated_cost_usd']} exceeds budget cap ${max_budget}"
            )

        # Confirm unless --yes or dry-run
        if not self.dry_run and not self.auto_yes:
            ans = input(f"Proceed with batch (~${cost['estimated_cost_usd']})? (y/n): ").strip().lower()
            if ans != "y":
                raise SystemExit("Aborted by operator.")

        return {"selected": selected, "cost": cost}

    # ---------------- Phase 2: lease ----------------

    def lease_instance(self) -> dict:
        banner("Phase 2 — lease Vast.ai instance")
        filt = self.config["offer_filters"]
        log(
            f"  Search: gpu={self.gpu_profile['gpu_name']} "
            f"reliability>={filt['min_reliability']} "
            f"dph<={filt['dph_max']} "
            f"type={filt['instance_type']}"
        )

        if self.dry_run:
            fake = {
                "instance_id": 0,
                "gpu_name": self.gpu_profile["gpu_name"],
                "dph_total": self.gpu_profile["max_price_per_hour"],
                "status": "dry-run",
                "ssh_host": "ssh.vast.ai (dry-run)",
            }
            log(f"  DRY-RUN: would lease cheapest matching offer — {fake}")
            return fake

        # Real path — implementation stub wrapping vastai_sdk.
        try:
            from vastai_sdk import VastAI  # type: ignore
        except Exception as exc:  # pragma: no cover
            raise RuntimeError(
                "vastai_sdk missing — pip install vastai-sdk"
            ) from exc

        client = VastAI(api_key=os.environ["VAST_API_KEY"])
        query = self._build_vast_query()
        log(f"  Vast.ai query: {query}")
        offers = client.search_offers(query=query, limit=20)
        if not offers:
            raise RuntimeError("no Vast.ai offers matched — widen filters or try later")

        images = self.config.get("docker_images") or []
        if not images:
            raise RuntimeError("render_config.yaml docker_images list is empty")

        last_exc: str | None = None
        for image_spec in images:
            image_name = image_spec["name"]
            log(f"  trying image: {image_name}")
            onstart = self._build_onstart(image_spec)
            env_flags = image_spec.get("env_flags", "")
            disk_gb = int(image_spec.get("min_disk_gb", 40))

            attempts = 0
            for offer in offers[: filt["lease_retries"]]:
                attempts += 1
                log(
                    f"  Lease attempt {attempts} [{image_name}]: offer {offer.get('id')} "
                    f"@ ${offer.get('dph_total')}/hr"
                )
                try:
                    launched = client.create_instance(
                        id=offer["id"],
                        image=image_name,
                        disk=disk_gb,
                        onstart_cmd=onstart,
                        env=env_flags,
                        runtype="ssh",
                        label="voidexa-vast_render",
                    )
                except Exception as exc:
                    last_exc = f"{image_name}: create_instance failed: {exc}"
                    log(f"  create_instance failed: {exc}")
                    continue

                instance_id = (
                    launched.get("new_contract")
                    or launched.get("instance_id")
                    or launched.get("id")
                )
                if not instance_id:
                    log(f"  unexpected create_instance response: {launched}")
                    last_exc = f"no instance_id in response: {launched}"
                    continue

                # Attach SSH key — not critical for this image (onstart handles setup),
                # but nice to have for post-hoc debugging via `ssh root@...`.
                ssh_pub_path = os.environ.get("VAST_SSH_PUBLIC_KEY_PATH")
                if ssh_pub_path:
                    pub_path = pathlib.Path(os.path.expanduser(ssh_pub_path))
                    if pub_path.exists():
                        try:
                            client.attach_ssh(
                                instance_id=instance_id,
                                ssh_key=pub_path.read_text(encoding="utf-8").strip(),
                            )
                            log(f"  attached ssh key {pub_path.name} to instance {instance_id}")
                        except Exception as exc:
                            log(f"  WARN: attach_ssh failed: {exc}")

                if self._wait_running(client, instance_id):
                    info = client.show_instance(id=instance_id)
                    return {
                        "instance_id": instance_id,
                        "gpu_name": self.gpu_profile["gpu_name"],
                        "dph_total": offer["dph_total"],
                        "status": "running",
                        "image": image_name,
                        "ssh_host": info.get("ssh_host") or info.get("public_ipaddr"),
                        "ssh_port": info.get("ssh_port"),
                        "public_ipaddr": info.get("public_ipaddr"),
                        "ports": info.get("ports"),
                        "raw": info,
                    }
                last_exc = f"{image_name}: instance {instance_id} never reached running"
                # loop continues to next offer with same image

            log(f"  all {attempts} offers exhausted for image {image_name}, falling back...")

        raise RuntimeError(f"all lease retries exhausted — last: {last_exc}")

    def _build_onstart(self, image_spec: dict) -> str:
        """Compose the container boot script: dirs + wget models + image init."""
        init = image_spec.get("init_cmd", "/bin/true")
        parts = [
            "env >> /etc/environment",
            "mkdir -p /workspace/ComfyUI/models/checkpoints "
            "/workspace/ComfyUI/models/vae /workspace/output",
        ]
        for m in self.config["model_files"]:
            # -c resumes, -nv = less-verbose, skip if target already non-empty
            parts.append(
                f"[ -s {shlex.quote(m['dest'])} ] || "
                f"wget -c -nv {shlex.quote(m['url'])} -O {shlex.quote(m['dest'])}"
            )
        parts.append(init)
        return " && ".join(parts)

    def _build_vast_query(self) -> str:
        filt = self.config["offer_filters"]
        parts = [
            f"gpu_name={self.gpu_profile['gpu_name']}",
            f"reliability>={filt['min_reliability']}",
            f"dph_total<={filt['dph_max']}",
            f"rentable={str(filt['rentable']).lower()}",
            f"inet_down>={filt['min_bandwidth_mbps']}",
        ]
        return " ".join(parts)

    def _wait_running(self, client: Any, instance_id: int) -> bool:
        timeout = self.config["offer_filters"]["lease_timeout_seconds"]
        poll = self.config["offer_filters"]["lease_poll_seconds"]
        status_log_gap = int(
            self.config["offer_filters"].get("lease_status_log_seconds", 30)
        )
        start = time.monotonic()
        deadline = start + timeout
        next_log = start  # log immediately on first poll so we see the starting state
        last_status: str | None = None
        log(f"  Waiting up to {timeout}s for instance {instance_id} to become ready...")
        while time.monotonic() < deadline:
            info = client.show_instance(id=instance_id) or {}
            status = info.get("actual_status") or info.get("status") or "unknown"
            status_msg = info.get("status_msg") or ""
            cur_state = info.get("cur_state") or info.get("intended_status") or ""
            elapsed = int(time.monotonic() - start)

            # Log on status change OR every status_log_gap seconds
            if status != last_status or time.monotonic() >= next_log:
                extras = []
                if cur_state and cur_state != status:
                    extras.append(f"cur_state={cur_state}")
                if status_msg:
                    extras.append(f"msg={status_msg.strip()[:160]}")
                extra_str = (" " + " ".join(extras)) if extras else ""
                log(f"  [+{elapsed:>3}s] instance {instance_id} status={status}{extra_str}")
                last_status = status
                next_log = time.monotonic() + status_log_gap

            if status == "running":
                return True
            time.sleep(poll)

        log(f"  Lease timed out after {timeout}s on instance {instance_id}, destroying...")
        try:
            client.destroy_instance(id=instance_id)
        except Exception as exc:
            log(f"  WARN: destroy_instance failed: {exc}")
        return False

    # ---------------- Phase 3: setup ----------------

    def setup_instance(self, instance: dict) -> None:
        """Wait for ComfyUI to come up on the leased instance.

        Model downloads and the ComfyUI launch both happen inside the
        container via the onstart_cmd we pass on create_instance — so this
        phase just resolves the public URL and polls `/queue` until it
        returns 200. No SSH needed on the happy path.
        """
        banner("Phase 3 — wait for ComfyUI")
        comfy_port = int(self.config["comfyui"]["port"])

        if self.dry_run:
            log(f"  DRY-RUN: onstart_cmd handles dirs + wget of "
                f"{len(self.config['model_files'])} models + init.sh")
            log(f"  DRY-RUN: would poll GET http://<ip>:{comfy_port}/queue until 200")
            self._comfy_base_url = f"http://dry-run.local:{comfy_port}"
            log(f"  DRY-RUN setup complete — mock base URL {self._comfy_base_url}")
            return

        base_url = self._resolve_comfy_base_url(instance, comfy_port)
        self._comfy_base_url = base_url
        log(f"  ComfyUI HTTP base: {base_url}")

        ready_timeout = int(self.config.get("comfyui", {}).get(
            "ready_timeout_seconds", 300
        ))
        self._wait_comfy_ready(base_url, ready_timeout)
        log("  ComfyUI ready — setup complete")

    # ---------- SSH helpers (paramiko) ----------

    def _resolve_ssh_private_key(self) -> pathlib.Path:
        """Derive private key path from VAST_SSH_PUBLIC_KEY_PATH (strip .pub)."""
        pub = os.environ.get("VAST_SSH_PUBLIC_KEY_PATH", "~/.ssh/id_ed25519.pub")
        pub_expanded = pathlib.Path(os.path.expanduser(pub))
        if pub_expanded.suffix == ".pub":
            priv = pub_expanded.with_suffix("")
        else:
            priv = pub_expanded
        if not priv.exists():
            raise FileNotFoundError(
                f"SSH private key not found at {priv} "
                "(derived from VAST_SSH_PUBLIC_KEY_PATH by stripping .pub)"
            )
        return priv

    def _ssh_connect(self, instance: dict) -> Any:
        import paramiko  # imported lazily so dry-run doesn't require it

        host = instance.get("ssh_host") or instance.get("public_ipaddr")
        port = int(instance.get("ssh_port") or 22)
        priv_key = self._resolve_ssh_private_key()

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        log(f"  ssh connect root@{host}:{port} key={priv_key.name}")
        ssh.connect(
            hostname=host,
            port=port,
            username="root",
            key_filename=str(priv_key),
            timeout=60,
            banner_timeout=60,
            auth_timeout=60,
            allow_agent=False,
            look_for_keys=False,
        )
        return ssh

    def _ssh_exec(self, ssh: Any, cmd: str, timeout: int = 120) -> tuple[str, str, int]:
        stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
        exit_code = stdout.channel.recv_exit_status()
        out = stdout.read().decode("utf-8", errors="replace")
        err = stderr.read().decode("utf-8", errors="replace")
        if exit_code != 0:
            raise RuntimeError(
                f"remote command failed (exit {exit_code}): {cmd[:120]}...\n"
                f"stderr: {err[:300]}"
            )
        return out, err, exit_code

    # ---------- ComfyUI HTTP helpers ----------

    def _resolve_comfy_base_url(self, instance: dict, inner_port: int) -> str:
        """Figure out the public URL Vast.ai exposes for ComfyUI.

        Vast maps container ports to host ports. Look for `ports` in the
        show_instance payload; fall back to public_ipaddr + inner_port.
        """
        public_host = instance.get("public_ipaddr") or instance.get("ssh_host")
        ports = instance.get("ports") or (instance.get("raw", {}) or {}).get("ports") or {}
        key = f"{inner_port}/tcp"
        mapping = ports.get(key) if isinstance(ports, dict) else None
        if mapping and isinstance(mapping, list) and mapping:
            host_port = mapping[0].get("HostPort")
            if host_port:
                return f"http://{public_host}:{host_port}"
        return f"http://{public_host}:{inner_port}"

    def _wait_comfy_ready(self, base_url: str, timeout_seconds: int) -> None:
        import requests

        deadline = time.monotonic() + timeout_seconds
        poll_gap = 3
        last_err: str | None = None
        while time.monotonic() < deadline:
            try:
                r = requests.get(f"{base_url}/queue", timeout=10)
                if r.status_code == 200:
                    return
                last_err = f"HTTP {r.status_code}"
            except Exception as exc:
                last_err = str(exc)[:120]
            time.sleep(poll_gap)
        raise RuntimeError(
            f"ComfyUI did not become ready at {base_url} within {timeout_seconds}s "
            f"(last error: {last_err})"
        )

    # ---------------- Phase 4: render ----------------

    def render_batch(self, selected: list[tuple[str, dict]], instance: dict) -> list[dict]:
        banner("Phase 4 — render batch")
        state = RenderState.load(self.state_path, self.source)
        state.current_instance_id = instance.get("instance_id")

        max_attempts = self.config["retry"]["per_prompt_max_attempts"]
        seed_offsets = self.config["retry"]["seed_offset_on_attempt"]
        halt_after = self.config["retry"]["consecutive_failure_halt"]
        max_budget = float(self.config["limits"]["max_budget_usd"])
        max_hours = float(self.config["limits"]["max_duration_hours"])
        rate = float(instance.get("dph_total") or self.gpu_profile["max_price_per_hour"])

        results: list[dict] = []
        consecutive_failures = 0
        start = time.monotonic()
        last_cost_log = start

        total = len(selected)
        for idx, (src, prompt) in enumerate(selected, 1):
            item_id = prompt["item_id"] if src == "shop" else prompt["card_id"]
            if item_id in state.completed:
                log(f"  [{idx}/{total}] skip (resumed): {item_id}")
                continue

            attempt_err: str | None = None
            success: dict | None = None
            for attempt in range(max_attempts):
                seed = int(prompt["suggested_seed"]) + seed_offsets[min(attempt, len(seed_offsets) - 1)]
                canvas = prompt.get("canvas", "768x1024")
                log(
                    f"  [{idx}/{total}] render {item_id} (attempt {attempt + 1}, seed {seed}, {canvas})"
                )
                try:
                    success = self._submit_comfyui_job(prompt, instance, seed, canvas)
                    break
                except Exception as exc:
                    attempt_err = str(exc)
                    log(f"    attempt failed: {exc}")

            if success is None:
                state.failed.append({"id": item_id, "source": src, "error": attempt_err or "unknown"})
                consecutive_failures += 1
                if consecutive_failures >= halt_after:
                    raise RuntimeError(f"halt: {consecutive_failures} consecutive failures")
                state.save(self.state_path)
                continue

            consecutive_failures = 0
            results.append(success)
            state.completed.append(item_id)

            elapsed = time.monotonic() - start
            state.duration_seconds = elapsed
            state.spent_usd = (elapsed / 3600.0) * rate
            if time.monotonic() - last_cost_log >= self.config["limits"]["cost_log_interval_seconds"]:
                done = len(state.completed)
                log(
                    f"  [cost] {done}/{total}  ${state.spent_usd:.2f}  elapsed {elapsed / 60:.1f}min"
                )
                last_cost_log = time.monotonic()

            if state.spent_usd > max_budget:
                raise RuntimeError(
                    f"BUDGET CUTOFF: spent ${state.spent_usd:.2f} exceeds ${max_budget}"
                )
            if elapsed / 3600.0 > max_hours:
                raise RuntimeError(f"DURATION CUTOFF: {elapsed / 3600.0:.2f}h exceeds {max_hours}h")

            state.save(self.state_path)

        log(f"  Rendered {len(results)} / {total} (failed {len(state.failed)})")
        return results

    def _build_comfy_workflow(self, prompt: dict, seed: int, canvas: str) -> dict:
        """Deep-copy the workflow template and inject inputs."""
        wf = json.loads(json.dumps(self.workflow))  # deep copy
        wf.pop("_comment", None)
        width_s, _, height_s = canvas.partition("x")
        wf["5"]["inputs"]["width"] = int(width_s)
        wf["5"]["inputs"]["height"] = int(height_s)
        wf["6"]["inputs"]["text"] = prompt["prompt_positive"]
        wf["7"]["inputs"]["text"] = prompt["prompt_negative"]
        wf["3"]["inputs"]["seed"] = int(seed)
        wf["3"]["inputs"]["steps"] = self.config["comfyui"]["steps"]
        wf["3"]["inputs"]["cfg"] = self.config["comfyui"]["cfg"]
        wf["3"]["inputs"]["sampler_name"] = self.config["comfyui"]["sampler_name"]
        wf["3"]["inputs"]["scheduler"] = self.config["comfyui"]["scheduler"]
        wf["4"]["inputs"]["ckpt_name"] = self.config["comfyui"]["checkpoint"]
        # filename prefix helps us find the output in /history
        item_id = prompt.get("card_id") or prompt.get("item_id") or "voidexa"
        wf["9"]["inputs"]["filename_prefix"] = f"voidexa_{item_id}"
        return wf

    def _submit_comfyui_job(
        self, prompt: dict, instance: dict, seed: int, canvas: str
    ) -> dict:
        """POST workflow to ComfyUI, poll /history, download result PNG."""
        started = time.monotonic()
        item_id = prompt.get("card_id") or prompt.get("item_id") or "voidexa"
        asset_type = (
            "shop" if "item_id" in prompt and "card_id" not in prompt else "card"
        )
        local_dir = self._image_tmp_dir / asset_type
        local_dir.mkdir(parents=True, exist_ok=True)
        local_path = local_dir / f"{item_id}.png"

        workflow = self._build_comfy_workflow(prompt, seed, canvas)

        if self.dry_run:
            # Exercise the workflow-build path with a mock response. No HTTP.
            base = self._comfy_base_url or "http://dry-run.local:8188"
            log(f"    [dry-run] POST {base}/prompt (workflow nodes: {sorted(workflow.keys())})")
            log(f"    [dry-run] poll /history simulated, output /view -> {local_path.name}")
            return {
                "source": asset_type,
                "item_id": item_id,
                "asset_type": asset_type,
                "seed": seed,
                "render_seconds": round(time.monotonic() - started, 3) + 1.2,
                "canvas": canvas,
                "rarity": prompt.get("rarity", "common"),
                "local_path": f"(dry-run) {local_path}",
                "style_anchor": prompt.get("style_anchor"),
                "render_source": f"dry-run/{self.gpu_profile['gpu_name']}",
                "instance_id": instance.get("instance_id"),
            }

        import requests

        base = self._comfy_base_url
        if not base:
            raise RuntimeError("ComfyUI base URL not set — setup_instance must run first")

        # 1. POST the prompt
        payload = {"prompt": workflow, "client_id": self.client_id}
        resp = requests.post(f"{base}/prompt", json=payload, timeout=30)
        if resp.status_code != 200:
            raise RuntimeError(
                f"ComfyUI /prompt returned {resp.status_code}: {resp.text[:200]}"
            )
        prompt_id = resp.json().get("prompt_id")
        if not prompt_id:
            raise RuntimeError(f"ComfyUI /prompt missing prompt_id: {resp.text[:200]}")

        # 2. Poll /history/<id> until done
        poll_gap = int(self.config["comfyui"].get("poll_seconds", 2))
        timeout = int(self.config["comfyui"].get("job_timeout_seconds", 120))
        deadline = time.monotonic() + timeout
        history: dict = {}
        while time.monotonic() < deadline:
            h = requests.get(f"{base}/history/{prompt_id}", timeout=15)
            if h.status_code == 200:
                data = h.json() or {}
                if prompt_id in data:
                    history = data[prompt_id]
                    status = (history.get("status") or {}).get("completed")
                    if status is True:
                        break
                    # ComfyUI marks status.completed=False if errored
                    if status is False and history.get("status", {}).get("status_str") == "error":
                        raise RuntimeError(
                            f"ComfyUI reported error for {prompt_id}: "
                            f"{(history.get('status') or {}).get('messages')}"
                        )
            time.sleep(poll_gap)
        else:
            raise RuntimeError(f"ComfyUI job {prompt_id} timed out after {timeout}s")

        # 3. Locate SaveImage output, GET /view, write to disk
        outputs = history.get("outputs") or {}
        image_meta = None
        for _node_id, node_output in outputs.items():
            images = node_output.get("images") or []
            if images:
                image_meta = images[0]
                break
        if not image_meta:
            raise RuntimeError(f"ComfyUI history {prompt_id} has no images: {outputs}")

        params = {
            "filename": image_meta["filename"],
            "subfolder": image_meta.get("subfolder", ""),
            "type": image_meta.get("type", "output"),
        }
        v = requests.get(f"{base}/view", params=params, timeout=60)
        if v.status_code != 200:
            raise RuntimeError(
                f"ComfyUI /view {image_meta['filename']} returned {v.status_code}"
            )
        local_path.write_bytes(v.content)

        return {
            "source": asset_type,
            "item_id": item_id,
            "asset_type": asset_type,
            "seed": seed,
            "render_seconds": round(time.monotonic() - started, 3),
            "canvas": canvas,
            "rarity": prompt.get("rarity", "common"),
            "local_path": str(local_path),
            "style_anchor": prompt.get("style_anchor"),
            "render_source": f"{self.gpu_profile['gpu_name']}/{instance.get('instance_id')}",
            "instance_id": instance.get("instance_id"),
        }

    # ---------------- Phase 5: upload ----------------

    def upload_results(self, results: list[dict]) -> list[dict]:
        banner("Phase 5 — upload to Supabase")
        bucket = self.config["supabase"]["bucket"]
        shop_prefix = self.config["supabase"]["shop_prefix"]
        card_prefix = self.config["supabase"]["card_prefix"]

        manifest: list[dict] = []
        for r in results:
            prefix = shop_prefix if r["asset_type"] == "shop" else card_prefix
            storage_path = f"{prefix}/{r['rarity']}/{r['item_id']}.png"
            public_url = f"(dry-run) https://<project>.supabase.co/storage/v1/object/public/{bucket}/{storage_path}"
            log(f"  upload {r['local_path']} -> {bucket}/{storage_path}")
            if self.dry_run:
                pass  # no network
            else:  # pragma: no cover - network path
                from supabase import create_client  # type: ignore

                client = create_client(
                    os.environ["SUPABASE_URL"],
                    os.environ["SUPABASE_SERVICE_ROLE_KEY"],
                )
                with open(r["local_path"], "rb") as fh:
                    client.storage.from_(bucket).upload(
                        storage_path,
                        fh,
                        file_options={"contentType": "image/png", "upsert": "true"},
                    )
                public_url = client.storage.from_(bucket).get_public_url(storage_path)
            manifest.append({
                "item_id": r["item_id"],
                "asset_type": r["asset_type"],
                "rarity": r["rarity"],
                "public_url": public_url,
                "rendered_at": datetime.now(timezone.utc).isoformat(),
                "seed": r["seed"],
                "render_seconds": r["render_seconds"],
                "canvas": r.get("canvas", "768x1024"),
                "style_anchor": r.get("style_anchor"),
                "render_source": r.get("render_source"),
            })
        return manifest

    def write_manifests(self, manifest: list[dict]) -> list[pathlib.Path]:
        banner("Phase 5b — write per-source manifests")
        paths: list[pathlib.Path] = []
        by_source: dict[str, list[dict]] = {"shop": [], "card": []}
        for m in manifest:
            by_source[m["asset_type"]].append(m)

        for src in ("shop", "cards"):
            asset = "shop" if src == "shop" else "card"
            rows = by_source[asset]
            if not rows:
                continue
            out = ROOT / self.config["sources"][src]["manifest_path"]
            out.parent.mkdir(parents=True, exist_ok=True)
            log(f"  writing {out.relative_to(ROOT)} ({len(rows)} rows)")
            if not self.dry_run:
                out.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
            paths.append(out)
        return paths

    # ---------------- Phase 6: teardown ----------------

    def teardown(self, instance: dict, results: list[dict], cost: dict) -> None:
        banner("Phase 6 — teardown + report")
        if self.dry_run:
            log("  DRY-RUN: would destroy instance 0 (no billing change)")
        else:  # pragma: no cover - network path
            from vastai_sdk import VastAI  # type: ignore

            client = VastAI(api_key=os.environ["VAST_API_KEY"])
            try:
                client.destroy_instance(id=instance["instance_id"])
                log(f"  instance {instance['instance_id']} destroyed (billing stopped)")
            except Exception as exc:
                log(f"  WARN: destroy failed: {exc} — verify manually at cloud.vast.ai")

        log(f"  rendered: {len(results)}")
        log(f"  estimated cost (budgeted): ${cost['estimated_cost_usd']}")

    # ---------------- Top-level run ----------------

    def run(self) -> int:
        banner(f"voidexa vast_render — source={self.source} test_n={self.test_n} gpu={self.gpu_key} dry_run={self.dry_run}")

        pre = self.preflight()
        selected = pre["selected"]
        cost = pre["cost"]

        instance = self.lease_instance()
        try:
            self.setup_instance(instance)
            results = self.render_batch(selected, instance)
            manifest = self.upload_results(results)
            self.write_manifests(manifest)
        finally:
            self.teardown(instance, locals().get("results", []), cost)

        log("DONE (dry-run)" if self.dry_run else "DONE")
        return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="voidexa Vast.ai render orchestrator",
    )
    parser.add_argument("--source", choices=["shop", "cards", "both"], required=False, default="cards")
    parser.add_argument("--test", type=int, default=0, help="0 = full batch, N>0 = stratified N-prompt preview")
    parser.add_argument("--gpu", dest="gpu_key", default=None, help="GPU profile key from render_config.yaml")
    parser.add_argument("--dry-run", action="store_true", help="simulate all phases, make no API calls")
    parser.add_argument("--yes", action="store_true", help="skip interactive cost confirmation")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    args = parse_args(argv)

    load_env()
    config = load_config()
    gpu_key = args.gpu_key or os.environ.get("VOIDEXA_RENDER_DEFAULT_GPU") or config["default_gpu"]
    if gpu_key not in config["gpu_profiles"]:
        log(f"unknown gpu profile {gpu_key!r} — available: {list(config['gpu_profiles'])}")
        return 2

    orch = Orchestrator(
        source=args.source,
        test_n=max(0, args.test),
        gpu_key=gpu_key,
        dry_run=args.dry_run,
        auto_yes=args.yes,
        config=config,
    )
    try:
        return orch.run()
    except SystemExit:
        raise
    except Exception as exc:
        log(f"FATAL: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
