param(
  [string]$BaseUrl = "http://127.0.0.1:4173",
  [int]$TimeoutSeconds = 10
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$routeData = Get-Content (Join-Path $repoRoot "data/asset-route-resolution.json") -Raw | ConvertFrom-Json

function Get-Url([string]$Path) { return "$($BaseUrl.TrimEnd('/'))/$($Path.TrimStart('/'))" }
function Request([string]$Path) {
  $url = Get-Url $Path
  try {
    $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec $TimeoutSeconds -MaximumRedirection 0 -ErrorAction Stop
    return [pscustomobject]@{ path = $Path; status = [int]$response.StatusCode; contentType = [string]$response.Headers["Content-Type"]; body = [string]$response.Content; redirected = $false }
  } catch {
    $status = 0
    $redirected = $false
    if ($_.Exception.PSObject.Properties['Response'] -and $_.Exception.Response) {
      try { $status = [int]$_.Exception.Response.StatusCode; $redirected = $status -ge 300 -and $status -lt 400 } catch {}
    }
    return [pscustomobject]@{ path = $Path; status = $status; contentType = ""; body = ""; redirected = $redirected }
  }
}

$checks = @()
$checks += Request "/"
$checks += Request "/sites/"
$checks += Request "/assets/js/app.js"
$checks += Request "/assets/css/styles.css"
$checks += Request "/assets/css/layout-fixes.css"
$checks += Request "/data/asset-route-resolution.json"
$checks += Request "/sites/Embed%20Code%20Generator%203/"
$checks += Request "/_batch-31-unknown-route/"

$resolved = @($routeData.entries | Where-Object { $_.resolutionStatus -eq "resolved" -and $_.resolvedPath })
foreach ($entry in $resolved) { $checks += Request ([string]$entry.resolvedPath) }

$failures = @()
foreach ($check in $checks) {
  $isJson = $check.path -like "*.json"
  $isScript = $check.path -like "*.js"
  $isCss = $check.path -like "*.css"
  $expectedType = if ($isJson) { "application/json" } elseif ($isScript) { "javascript" } elseif ($isCss) { "text/css" } else { "text/html" }
  $typeOk = $check.contentType -match $expectedType
  $bodyOk = if ($check.path -eq "/") { $check.body -match "Flash UI" -and $check.body -match "assets/js/app\.js" } elseif ($check.path -eq "/sites/") { $check.body -match 'data-page="catalog"' -and $check.body -match "assets/js/app\.js" } else { $true }
  $expectedMissing = $check.path -like "*Embed%20Code%20Generator%203*" -or $check.path -eq "/_batch-31-unknown-route/"
  $ok = if ($expectedMissing) { $check.status -eq 404 -and -not $check.redirected } else { $check.status -eq 200 -and $typeOk -and $bodyOk }
  if (-not $ok) { $failures += [pscustomobject]@{ path = $check.path; status = $check.status; contentType = $check.contentType; expected = $expectedType } }
}

$summary = [ordered]@{
  baseUrl = $BaseUrl
  checked = $checks.Count
  resolvedRoutesChecked = $resolved.Count
  passed = $checks.Count - $failures.Count
  failed = $failures.Count
  staleEmbedRoute = if ($checks | Where-Object { $_.path -like "*Embed%20Code%20Generator%203*" -and $_.status -eq 404 -and -not $_.redirected }) { "404-no-redirect" } else { "failed" }
  unknownRoute = if ($checks | Where-Object { $_.path -eq "/_batch-31-unknown-route/" -and $_.status -eq 404 -and -not $_.redirected }) { "404-no-redirect" } else { "failed" }
  failures = @($failures)
}
$summary | ConvertTo-Json -Depth 8
if ($failures.Count -gt 0) { exit 1 }
