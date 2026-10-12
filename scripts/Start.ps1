param([Parameter(Mandatory=$true)][string]$AppDir,[Parameter(Mandatory=$true)][string]$NodePath,[string]$ProfileDir)
try {
$ErrorActionPreference='Stop'
$AppDir=(Resolve-Path -LiteralPath $AppDir).Path
if($AppDir -match 'WindowsApps'){throw 'Use the staged copy'}
$app=Join-Path $AppDir 'ChatGPT.exe'
$profile=if($ProfileDir){[IO.Path]::GetFullPath($ProfileDir)}else{Join-Path (Split-Path $AppDir -Parent) 'profile'}
$ready=$false
try{$ready=@(Invoke-RestMethod 'http://127.0.0.1:9343/json/list' -TimeoutSec 1|Where-Object {$_.url -like 'app://-/index.html*'}).Count -gt 0}catch{}
if($ready){$listener=Get-NetTCPConnection -LocalPort 9343 -State Listen -ErrorAction Stop | Select-Object -First 1;$ownerProcess=Get-CimInstance Win32_Process -Filter ('ProcessId='+$listener.OwningProcess);if(-not $ownerProcess -or $ownerProcess.ExecutablePath -ne $app){throw 'Port 9343 belongs to another application copy; close it before launching this deployment'}}
if(-not $ready){Start-Process -FilePath $app -ArgumentList ('--user-data-dir="'+$profile+'"'),'--remote-debugging-address=127.0.0.1','--remote-debugging-port=9343','--lang=zh-CN','--disable-features=CalculateNativeWinOcclusion','--disable-backgrounding-occluded-windows' -WindowStyle Hidden
for($i=0;$i -lt 90;$i++){Start-Sleep -Milliseconds 300;try{if(@(Invoke-RestMethod 'http://127.0.0.1:9343/json/list' -TimeoutSec 1|Where-Object {$_.url -eq 'app://-/index.html'}).Count -gt 0){$ready=$true;break}}catch{}}}
if(-not $ready){throw 'Application did not start'}
function Run-Node([string]$Script,[string]$Mode){$p=New-Object Diagnostics.ProcessStartInfo;$p.FileName=$NodePath;$p.Arguments='"'+(Join-Path $PSScriptRoot $Script)+'" '+$Mode;$p.UseShellExecute=$false;$p.CreateNoWindow=$true;$p.RedirectStandardOutput=$true;$p.RedirectStandardError=$true;$proc=New-Object Diagnostics.Process;$proc.StartInfo=$p;[void]$proc.Start();$out=$proc.StandardOutput.ReadToEndAsync();$err=$proc.StandardError.ReadToEndAsync();$proc.WaitForExit();if($proc.ExitCode -ne 0){throw $err.Result};Write-Output $out.Result}
Run-Node 'window-runtime.mjs' 'enable'
Run-Node 'inject.mjs' '--once'
Run-Node 'window-runtime.mjs' 'enable'
Run-Node 'window-runtime.mjs' 'health'
$stop=Join-Path $PSScriptRoot 'stop-dock';if(Test-Path $stop){Remove-Item -LiteralPath $stop}
foreach($spec in @(@{Name='skin';Script='inject.mjs';Mode='--watch'},@{Name='mode';Script='window-runtime.mjs';Mode='watch-mode'})){
$pidFile=Join-Path $PSScriptRoot ($spec.Name+'-pid.txt');$exists=$false;if(Test-Path $pidFile){$worker=Get-CimInstance Win32_Process -Filter ('ProcessId='+[int](Get-Content $pidFile));$exists=$worker -and $worker.CommandLine.Contains((Join-Path $PSScriptRoot $spec.Script))}
if(-not $exists){$worker=Start-Process -FilePath $NodePath -ArgumentList ('"'+(Join-Path $PSScriptRoot $spec.Script)+'"'),$spec.Mode -WindowStyle Hidden -RedirectStandardOutput (Join-Path $PSScriptRoot ($spec.Name+'.log')) -RedirectStandardError (Join-Path $PSScriptRoot ($spec.Name+'-error.log')) -PassThru;$worker.Id|Set-Content $pidFile}}

} catch {
 $message=$_.Exception.Message
 $diagnostics=Join-Path $PSScriptRoot 'startup-error.log'
 [IO.File]::AppendAllText($diagnostics,((Get-Date).ToString('s')+' '+$message+"`n"),[Text.UTF8Encoding]::new($false))
 Add-Type -AssemblyName System.Windows.Forms
 [void][Windows.Forms.MessageBox]::Show(('启动失败：'+$message+"`n诊断日志："+$diagnostics),'Qdex 2007')
 throw
}
