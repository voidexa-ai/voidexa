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
import sys
import time
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

        attempts = 0
        for offer in offers[: filt["lease_retries"]]:
            attempts += 1
            log(
                f"  Lease attempt {attempts}: offer {offer.get('id')} "
                f"@ ${offer.get('dph_total')}/hr"
            )
            launched = client.launch_instance(
                id=offer["id"],
                image=self.config["docker_image"],
                disk=40,
                env={"COMFY_PORT": str(self.config["comfyui"]["port"])},
            )
            instance_id = launched["new_contract"]
            if self._wait_running(client, instance_id):
                info = client.show_instance(id=instance_id)
                return {
                    "instance_id": instance_id,
                    "gpu_name": self.gpu_profile["gpu_name"],
                    "dph_total": offer["dph_total"],
                    "status": "running",
                    "ssh_host": info.get("ssh_host"),
                    "ssh_port": info.get("ssh_port"),
                }
        raise RuntimeError("all lease retries exhausted")

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
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            info = client.show_instance(id=instance_id)
            if info.get("actual_status") == "running":
                return True
            time.sleep(poll)
        log(f"  Lease timed out after {timeout}s on instance {instance_id}, destroying...")
        try:
            client.destroy_instance(id=instance_id)
        except Exception:
            pass
        return False

    # ---------------- Phase 3: setup ----------------

    def setup_instance(self, instance: dict) -> None:
        banner("Phase 3 — instance setup (models + ComfyUI)")
        log(f"  Target: ssh {instance.get('ssh_host')} :{instance.get('ssh_port')}")
        for m in self.config["model_files"]:
            log(f"  Ensure model: {m['name']} -> {m['dest']}")
        log(f"  Start ComfyUI on port {self.config['comfyui']['port']} (background)")
        log(f"  Upload workflow template: {WORKFLOW_PATH.name}")
        if self.dry_run:
            log("  DRY-RUN: setup simulated — no SSH, no downloads")
            return
        # Production wiring — see master doc Phase 3:
        #   SSH in via paramiko / fabric using VAST_SSH_PUBLIC_KEY_PATH private pair.
        #   For each m in model_files: wget -c <url> -O <dest> (skip if present).
        #   nohup python3 /workspace/ComfyUI/main.py --listen 0.0.0.0 --port 8188 &
        #   Verify http://<instance>:8188/queue responds 200.
        #   scp scripts/voidexa_sdxl_workflow.json -> /workspace/workflow.json
        log("  NOTE: production SSH/model-download wiring deferred to render-time sprint.")

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
                if self.dry_run:
                    success = self._simulated_render_result(src, prompt, instance, seed)
                    break
                try:
                    success = self._submit_comfyui_job(prompt, instance, seed, canvas)
                    break
                except Exception as exc:  # pragma: no cover - network path
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

    def _simulated_render_result(
        self, src: str, prompt: dict, instance: dict, seed: int
    ) -> dict:
        item_id = prompt["item_id"] if src == "shop" else prompt["card_id"]
        return {
            "source": src,
            "item_id": item_id,
            "asset_type": self.config["sources"][src]["asset_type"],
            "seed": seed,
            "render_seconds": 1.2,
            "canvas": prompt.get("canvas", "768x1024"),
            "rarity": prompt.get("rarity", "common"),
            "local_path": f"(dry-run) /tmp/voidexa/{item_id}.png",
            "style_anchor": prompt.get("style_anchor"),
            "render_source": f"dry-run/{self.gpu_profile['gpu_name']}",
            "instance_id": instance.get("instance_id"),
        }

    def _submit_comfyui_job(
        self, prompt: dict, instance: dict, seed: int, canvas: str
    ) -> dict:  # pragma: no cover - network path
        # Build the workflow payload from the template by substituting inputs.
        wf = json.loads(json.dumps(self.workflow))  # deep copy
        width, _, height = canvas.partition("x")
        wf["5"]["inputs"]["width"] = int(width)
        wf["5"]["inputs"]["height"] = int(height)
        wf["6"]["inputs"]["text"] = prompt["prompt_positive"]
        wf["7"]["inputs"]["text"] = prompt["prompt_negative"]
        wf["3"]["inputs"]["seed"] = int(seed)
        wf["3"]["inputs"]["steps"] = self.config["comfyui"]["steps"]
        wf["3"]["inputs"]["cfg"] = self.config["comfyui"]["cfg"]
        wf["3"]["inputs"]["sampler_name"] = self.config["comfyui"]["sampler_name"]
        wf["3"]["inputs"]["scheduler"] = self.config["comfyui"]["scheduler"]
        wf["4"]["inputs"]["ckpt_name"] = self.config["comfyui"]["checkpoint"]

        # Production wiring (deferred): POST {prompt: wf} to
        #   http://<instance-ip>:<comfy-port>/prompt
        # Poll /history/<prompt_id> until done, then GET the output PNG via
        # /view?filename=...&type=output&subfolder=... and write it locally.
        raise NotImplementedError(
            "ComfyUI HTTP path not wired — render-time sprint will enable this"
        )

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
