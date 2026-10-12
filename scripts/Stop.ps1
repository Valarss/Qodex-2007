param([Parameter(Mandatory=$true)][string]$NodePath)
$ErrorActionPreference='Stop'
'stop'|Set-Content (Join-Path $PSScriptRoot 'stop-dock')
foreach($name in @('skin','mode')){$f=Join-Path $PSScriptRoot ($name+'-pid.txt');if(Test-Path $f){$workerId=[int](Get-Content $f);$p=Get-CimInstance Win32_Process -Filter "ProcessId=$workerId";if($p -and $p.CommandLine.Contains($PSScriptRoot) -and $p.CommandLine -match '(inject.mjs|window-runtime.mjs)'){Stop-Process -Id $workerId}}}
& $NodePath (Join-Path $PSScriptRoot 'window-runtime.mjs') native
