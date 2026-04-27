# scripts/convert_alpha_to_webp.ps1
# AFS-18 Task 2: convert 1000 Alpha PNGs to webp at quality 85.
#
# Source: $env:USERPROFILE\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered\
# Output: $env:USERPROFILE\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_webp\
#
# Resume-safe: skips files where the .webp already exists.
# Requires: cwebp.exe in PATH (winget install Google.LibWebP).

$ErrorActionPreference = 'Stop'

$source = Join-Path $env:USERPROFILE 'Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered'
$output = Join-Path $env:USERPROFILE 'Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_webp'
$quality = 85

if (-not (Test-Path $source)) {
    Write-Error "Source directory not found: $source"
    exit 1
}

if (-not (Test-Path $output)) {
    New-Item -ItemType Directory -Path $output | Out-Null
    Write-Host "Created output directory: $output"
}

# Verify cwebp is available without throwing on stderr noise.
$cwebpExists = $null -ne (Get-Command cwebp -ErrorAction SilentlyContinue)
if (-not $cwebpExists) {
    Write-Error "cwebp not found in PATH. Install with: winget install Google.LibWebP"
    exit 1
}

$pngFiles = Get-ChildItem -Path $source -Filter '*.png' -File | Sort-Object Name
$total = $pngFiles.Count
Write-Host "Found $total PNG files in source."

if ($total -eq 0) {
    Write-Error "No PNG files in source directory."
    exit 1
}

$converted = 0
$skipped = 0
$failed = 0
$totalSourceBytes = [int64]0
$totalOutputBytes = [int64]0

$startedAt = Get-Date

for ($i = 0; $i -lt $total; $i++) {
    $png = $pngFiles[$i]
    $webpName = [System.IO.Path]::ChangeExtension($png.Name, '.webp')
    $webpPath = Join-Path $output $webpName

    if (Test-Path $webpPath) {
        $skipped++
        $totalSourceBytes += $png.Length
        $totalOutputBytes += (Get-Item $webpPath).Length
        continue
    }

    $idx = $i + 1
    $pct = [math]::Round($idx / $total * 100, 1)
    Write-Host ("[{0}/{1} {2}%] {3} ..." -f $idx, $total, $pct, $png.Name) -NoNewline

    try {
        & cwebp -q $quality -quiet $png.FullName -o $webpPath
        if ($LASTEXITCODE -ne 0) {
            throw "cwebp exit code $LASTEXITCODE"
        }
        if (-not (Test-Path $webpPath)) {
            throw "cwebp ran but no output file produced"
        }

        $srcSize = $png.Length
        $outSize = (Get-Item $webpPath).Length
        $ratio = [math]::Round($outSize / $srcSize * 100, 1)

        Write-Host (" OK {0} KB -> {1} KB ({2}%)" -f `
            [math]::Round($srcSize / 1KB, 0), `
            [math]::Round($outSize / 1KB, 0), `
            $ratio)

        $converted++
        $totalSourceBytes += $srcSize
        $totalOutputBytes += $outSize
    } catch {
        Write-Host (" FAILED: {0}" -f $_)
        $failed++
        if (Test-Path $webpPath) {
            Remove-Item $webpPath -Force -ErrorAction SilentlyContinue
        }
    }
}

$elapsed = (Get-Date) - $startedAt

Write-Host ""
Write-Host "=========================================="
Write-Host "AFS-18 webp conversion summary"
Write-Host "=========================================="
Write-Host ("Converted:        {0}" -f $converted)
Write-Host ("Skipped (resume): {0}" -f $skipped)
Write-Host ("Failed:           {0}" -f $failed)
Write-Host ("Total in:         {0:N1} MB" -f ($totalSourceBytes / 1MB))
Write-Host ("Total out:        {0:N1} MB" -f ($totalOutputBytes / 1MB))
if ($totalSourceBytes -gt 0) {
    $overallRatio = [math]::Round($totalOutputBytes / $totalSourceBytes * 100, 1)
    $reduction = [math]::Round(100 - $overallRatio, 1)
    Write-Host ("Output / source:  {0}% ({1}% reduction)" -f $overallRatio, $reduction)
}
Write-Host ("Elapsed:          {0:hh\:mm\:ss}" -f $elapsed)
Write-Host ""
Write-Host "Output dir: $output"
Write-Host ""
Write-Host "Spot-check 6 webp files (1 per rarity tier) before Task 3 upload."
