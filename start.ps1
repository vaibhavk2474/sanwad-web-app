Start-Process cmd -ArgumentList "/k cd /d $PSScriptRoot\frontend && npm start"
Start-Process cmd -ArgumentList "/k cd /d $PSScriptRoot\backend && npm start"


<#
run in terminal
   powershell -ExecutionPolicy Bypass -File start.ps1
#>