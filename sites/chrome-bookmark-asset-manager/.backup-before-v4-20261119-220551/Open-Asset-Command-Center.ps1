param([switch]$Refresh,[switch]$CheckWeb,[switch]$GitHub,[int]$Limit=0)
$ErrorActionPreference='Stop'
$root=$PSScriptRoot
$target=Join-Path $root 'OPEN-BOOKMARK-LIBRARY-ASSET-MANAGER.html'
if($Refresh -or $CheckWeb -or $GitHub){
  $python=Get-Command py -ErrorAction SilentlyContinue
  if($python){$exe='py';$prefix=@('-3')}else{$python=Get-Command python -ErrorAction SilentlyContinue;if(-not $python){throw 'Python 3 is required for enrichment.'};$exe='python';$prefix=@()}
  $arguments=@((Join-Path $root 'enrich_assets.py'))
  if($Refresh -or $CheckWeb){$arguments+='--check-web'}
  if($Refresh -or $GitHub){$arguments+='--github'}
  if($Limit -gt 0){$arguments+=@('--limit',"$Limit")}
  & $exe @prefix @arguments
  if($LASTEXITCODE -ne 0){throw 'Refresh failed; no retry attempted.'}
}
if(-not (Test-Path $target)){throw "Dashboard not found: $target"}
Start-Process $target
Write-Host "Opened Asset Command Center: $target"
