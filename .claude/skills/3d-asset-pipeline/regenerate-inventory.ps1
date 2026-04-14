# regenerate-inventory.ps1
# Rebuilds public/models/ASSET_INVENTORY.md from whatever is currently on disk.
# Idempotent. Run from anywhere inside the voidexa repo.
#
# Usage:
#   pwsh .claude/skills/3d-asset-pipeline/regenerate-inventory.ps1
#   or from the repo root: powershell -ExecutionPolicy Bypass -File .claude\skills\3d-asset-pipeline\regenerate-inventory.ps1

$ErrorActionPreference = "Stop"

# --- Locate repo root (walk up from this script until we find public/models/) ---
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot  = $scriptDir
while ($repoRoot -and -not (Test-Path (Join-Path $repoRoot "public\models"))) {
    $parent = Split-Path -Parent $repoRoot
    if ($parent -eq $repoRoot) { throw "Could not find public/models/ from $scriptDir" }
    $repoRoot = $parent
}
$models    = Join-Path $repoRoot "public\models"
$inventory = Join-Path $models   "ASSET_INVENTORY.md"

# --- Folder layout (authoritative; matches SKILL.md) ---
$folders = @(
    "ships\paid\usc",
    "ships\paid\usc-expansion",
    "ships\paid\hirez",
    "ships\free\quaternius-spaceships",
    "ships\free\quaternius-space-kit",
    "ships\free\quaternius-modular-scifi",
    "ships\free\sketchfab",
    "cockpits",
    "stations"
)

# --- Helpers ---
function Get-RealFormats($path) {
    # Returns alphabetical comma-separated list of sensible file extensions.
    # Filters out Adobe Fuse .fuse_hidden* pseudo-extensions and anything > 8 chars.
    if (-not (Test-Path $path)) { return "" }
    Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue |
        ForEach-Object { $_.Extension.TrimStart('.').ToLower() } |
        Where-Object { $_ -and $_.Length -le 8 -and $_ -match '^[a-z0-9]+$' } |
        Sort-Object -Unique |
        Join-String -Separator ','
}

function Get-FuseHiddenCount($path) {
    if (-not (Test-Path $path)) { return 0 }
    (Get-ChildItem -Path $path -Recurse -File -Filter "*fuse_hidden*" -ErrorAction SilentlyContinue |
        Measure-Object).Count
}

function Format-MB([long]$bytes) {
    "{0:N2} MB" -f ($bytes / 1MB)
}

# --- Build markdown ---
$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add("# 3D Asset Inventory")
$lines.Add("")
$lines.Add("Generated: {0}" -f (Get-Date -AsUTC -Format "yyyy-MM-ddTHH:mmZ"))
$lines.Add("")
$lines.Add("Location: ``public/models/``")
$lines.Add("")
$lines.Add("Binary assets are gitignored — this file is the authoritative record of what should be on disk. Re-extract from the original zips in ``Downloads/`` if anything is missing.")
$lines.Add("")
$lines.Add("Hidden-file note: USC and Hirez packs contain many Adobe Fuse ``.fuse_hidden*`` tempfiles. They are counted in the totals but excluded from the Formats list; counted separately as ""Fuse hidden"".")
$lines.Add("")

$grandFiles = 0
[long]$grandBytes = 0

foreach ($f in $folders) {
    $full = Join-Path $models $f
    if (-not (Test-Path $full)) { continue }

    $files  = Get-ChildItem -Path $full -Recurse -File -ErrorAction SilentlyContinue
    $count  = ($files | Measure-Object).Count
    $bytes  = [long](($files | Measure-Object -Property Length -Sum).Sum)
    if (-not $bytes) { $bytes = 0 }
    $hidden = Get-FuseHiddenCount $full
    $fmts   = Get-RealFormats $full
    if (-not $fmts) { $fmts = "(none)" }

    $lines.Add("## $($f -replace '\\','/')")
    $lines.Add("")
    $lines.Add("- File count: $count")
    if ($hidden -gt 0) { $lines.Add("- Fuse hidden: $hidden") }
    $lines.Add("- Formats: $fmts")
    $lines.Add("- Total size: $(Format-MB $bytes)")
    $lines.Add("")

    if ($f -eq "ships\free\sketchfab") {
        $lines.Add("### Sketchfab pack breakdown")
        $lines.Add("")
        Get-ChildItem -Path $full -Directory -ErrorAction SilentlyContinue | ForEach-Object {
            $sub    = $_.FullName
            $sFiles = Get-ChildItem -Path $sub -Recurse -File -ErrorAction SilentlyContinue
            $sc     = ($sFiles | Measure-Object).Count
            $sb     = [long](($sFiles | Measure-Object -Property Length -Sum).Sum)
            if (-not $sb) { $sb = 0 }
            $sfmt   = Get-RealFormats $sub
            if (-not $sfmt) { $sfmt = "(none)" }
            $lines.Add("- ``$($_.Name)/`` — $sc files, $(Format-MB $sb), formats: $sfmt")
        }
        $lines.Add("")
    }

    $grandFiles += $count
    $grandBytes += $bytes
}

$lines.Add("---")
$lines.Add("")
$lines.Add(("**Grand total:** {0} files, {1} ({2:N2} GB)" -f `
    $grandFiles, (Format-MB $grandBytes), ($grandBytes / 1GB)))
$lines.Add("")
$lines.Add("## Source zip mapping")
$lines.Add("")
$lines.Add("| Zip in Downloads/ | Target folder |")
$lines.Add("|---|---|")
$mapping = @(
    "usc_fbx.zip|ships/paid/usc/",
    "usc_expansion_fbx.zip|ships/paid/usc-expansion/",
    "hirezspaceshipscreator_obj.zip|ships/paid/hirez/",
    "Ultimate Spaceships - May 2021*.zip|ships/free/quaternius-spaceships/",
    "Ultimate Space Kit - March 2023*.zip|ships/free/quaternius-space-kit/",
    "Ultimate Modular Sci-Fi - Feb 2021*.zip|ships/free/quaternius-modular-scifi/",
    "spaceship_cockpit__seat.zip|cockpits/",
    "sci-fi_spaceship_cockpit_02.zip|cockpits/",
    "sci-fi_ship_interior_-_modular_asset_pack.zip|stations/",
    "aquaris.zip|ships/free/sketchfab/aquaris/",
    "bff3-212-cyclone_recreation_2018_archived_work.zip|ships/free/sketchfab/bff3-212-cyclone_recreation_2018_archived_work/",
    "files.zip|ships/free/sketchfab/files/",
    "galaxy_on_fire_2_-_supernova_dlc_terran_carrier.zip|ships/free/sketchfab/galaxy_on_fire_2_-_supernova_dlc_terran_carrier/",
    "lowpoly_spaceships.zip|ships/free/sketchfab/lowpoly_spaceships/",
    "sci-fi_aircraft__spaceship_fighter.zip|ships/free/sketchfab/sci-fi_aircraft__spaceship_fighter/",
    "ship.zip|ships/free/sketchfab/ship/",
    "spaceship.zip|ships/free/sketchfab/spaceship/",
    "star_trek_online__eisenberg_class__uss_nog.zip|ships/free/sketchfab/star_trek_online__eisenberg_class__uss_nog/",
    "uss_enterprise_refit_battle_damage.zip|ships/free/sketchfab/uss_enterprise_refit_battle_damage/"
)
foreach ($row in $mapping) {
    $parts = $row -split '\|'
    $lines.Add("| $($parts[0]) | $($parts[1]) |")
}
$lines.Add("")
$lines.Add("## Notes")
$lines.Add("")
$lines.Add("- Task spec referenced ``sci_fi_spaceship_cockpit_02.zip`` (underscores); actual file is ``sci-fi_spaceship_cockpit_02.zip`` (dash) — used the real filename.")
$lines.Add("- Two Quaternius Spaceships bundles were present (``*-194756Z-*`` and ``*-195142Z-*``); identical contents — extract either one.")
$lines.Add("- All original zips preserved in ``C:\Users\Jixwu\Downloads\`` — nothing deleted.")
$lines.Add("- Regenerate this file with ``pwsh .claude/skills/3d-asset-pipeline/regenerate-inventory.ps1`` after any asset changes.")

# --- Write atomically ---
$tmp = "$inventory.tmp"
$lines -join "`r`n" | Out-File -FilePath $tmp -Encoding UTF8 -NoNewline
Move-Item -Path $tmp -Destination $inventory -Force

Write-Host "Wrote $inventory" -ForegroundColor Green
Write-Host "  $grandFiles files, $(Format-MB $grandBytes)" -ForegroundColor Green
