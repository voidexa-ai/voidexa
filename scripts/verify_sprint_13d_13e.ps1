$ErrorActionPreference = 'Stop'
Write-Host "=== Sprint 13d + 13e Verification ===" -ForegroundColor Cyan

function Get-Url($url) {
    try {
        return Invoke-WebRequest -Uri $url -UseBasicParsing -ErrorAction Stop
    } catch {
        return $_.Exception.Response
    }
}

# 1. Homepage loads
$homepage = Invoke-WebRequest -Uri "https://voidexa.com/" -UseBasicParsing
Write-Host "1. Homepage status: $($homepage.StatusCode)"
$hasVideo = $homepage.Content -match "voidexa_intro_final"
Write-Host "   Video URL present: $hasVideo"

# 2. /home loads
$homeAlt = Invoke-WebRequest -Uri "https://voidexa.com/home" -UseBasicParsing
Write-Host "2. /home status: $($homeAlt.StatusCode)"

# 3. /break-room loads
$breakRoom = Invoke-WebRequest -Uri "https://voidexa.com/break-room" -UseBasicParsing
Write-Host "3. /break-room status: $($breakRoom.StatusCode)"

# 3b. /dk/break-room loads
try {
    $dkBreakRoom = Invoke-WebRequest -Uri "https://voidexa.com/dk/break-room" -UseBasicParsing
    Write-Host "3b. /dk/break-room status: $($dkBreakRoom.StatusCode)"
} catch {
    Write-Host "3b. /dk/break-room error: $($_.Exception.Message)"
}

# 4. Quick menu route
$quickMenu = Invoke-WebRequest -Uri "https://voidexa.com/?menu=true" -UseBasicParsing
Write-Host "4. /?menu=true status: $($quickMenu.StatusCode)"

# 5. Shop loads
$shop = Invoke-WebRequest -Uri "https://voidexa.com/shop" -UseBasicParsing
Write-Host "5. /shop status: $($shop.StatusCode)"
$hasGhaiText = $shop.Content -match "GHAI"
Write-Host "   'GHAI' text in shop: $hasGhaiText"

# 6. GHAI API auth-gated
try {
    $ghaiApi = Invoke-WebRequest -Uri "https://voidexa.com/api/ghai/balance" -UseBasicParsing -ErrorAction Stop
    Write-Host "6. /api/ghai/balance status: $($ghaiApi.StatusCode) (UNEXPECTED - should be 401)"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "6. /api/ghai/balance returns $code (expected 401 Unauthorized)"
}

# 7. Mission Board loads
$mission = Invoke-WebRequest -Uri "https://voidexa.com/game/mission-board" -UseBasicParsing
Write-Host "7. /game/mission-board status: $($mission.StatusCode)"
$missionHasGhai = $mission.Content -match "GHAI"
Write-Host "   Mission Board shows GHAI: $missionHasGhai"

# 8. Starmap loads
$starmap = Invoke-WebRequest -Uri "https://voidexa.com/starmap" -UseBasicParsing
Write-Host "8. /starmap status: $($starmap.StatusCode)"

# 9. Nav contains Break Room link (homepage HTML should include /break-room href)
$navHasBreakRoom = $homepage.Content -match "/break-room"
Write-Host "9. Homepage nav references /break-room: $navHasBreakRoom"

Write-Host "=== Verification complete ===" -ForegroundColor Green
