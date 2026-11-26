param([int]$Port=8765)
$ErrorActionPreference='Stop'
$uri="http://127.0.0.1:$Port/"
try {$existing=Invoke-RestMethod -Uri "${uri}api/state" -TimeoutSec 2 -ErrorAction Stop}catch{$existing=$null}
if($existing){Start-Process $uri;Write-Host "Already running: $uri";exit}
if(Get-Command py -ErrorAction SilentlyContinue){$exe='py';$prefix=@('-3')}elseif(Get-Command python -ErrorAction SilentlyContinue){$exe='python';$prefix=@()}else{throw 'Python 3 required.'}
Write-Host 'Leave this window open while using the app. Chrome reimport is manual only.'
& $exe @prefix (Join-Path $PSScriptRoot 'app_server.py') --port $Port
