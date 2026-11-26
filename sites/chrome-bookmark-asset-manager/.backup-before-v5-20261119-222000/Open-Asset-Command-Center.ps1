param([switch]$Refresh,[switch]$CheckWeb,[switch]$GitHub,[int]$Port=8765)
$ErrorActionPreference='Stop'
$root=$PSScriptRoot
$uri="http://127.0.0.1:$Port/"
try { $running=Invoke-WebRequest -Uri "${uri}api/state" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop } catch {$running=$null}
if ($running) {
  Write-Host "Asset Command Center is already running at $uri"
  Start-Process $uri
  if ($Refresh -or $CheckWeb -or $GitHub) {
    $body=@{ checks=($CheckWeb -or $GitHub) }|ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "${uri}api/refresh" -Method Post -Body $body -ContentType 'application/json' | Out-Null
    Write-Host 'Refresh requested.'
  }
  exit 0
}
$py=Get-Command py -ErrorAction SilentlyContinue
if($py){$exe='py';$prefix=@('-3')}else{$py=Get-Command python -ErrorAction SilentlyContinue;if(-not $py){throw 'Python 3 is required. Install Python 3 and re-run the launcher.'};$exe='python';$prefix=@()}
Write-Host "Starting local Asset Command Center at $uri"
Write-Host 'Leave this PowerShell window open to keep the app and Chrome sync running. Close it to stop.'
if($Refresh -or $CheckWeb -or $GitHub){Write-Host 'Use the Refresh sites + GitHub button in the app after launch.'}
& $exe @prefix (Join-Path $root 'app_server.py') --port $Port
