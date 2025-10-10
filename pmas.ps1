# This code downloads the script file for the Turkish or English PMAS v5 [Powershell Multi Activation System] application from the Github site, depending on the operating system language.

# pmasdownload.ps1

$culture = (Get-Culture).Name

if ($culture -like 'tr-*') {
    $url = 'https://raw.githubusercontent.com/abdullah-erturk/pmas/refs/heads/main/TR/PMAS_v5_TR.bat'  # Turkish version
    Write-Host
    Write-Host "Turkish system detected. Downloading Turkish script..." -ForegroundColor Cyan
} else {
    $url = 'https://raw.githubusercontent.com/abdullah-erturk/pmas/refs/heads/main/ENG/PMAS_v5_ENG.bat'  # English version
    Write-Host
    Write-Host "Non-Turkish system detected. Downloading English script..." -ForegroundColor Yellow
}

$filename = "$env:TEMP\pmas.cmd"

try {
    Invoke-WebRequest -Uri $url -OutFile $filename -UseBasicParsing
    Write-Host
    Write-Host "Script downloaded: $filename" -ForegroundColor Green
}
catch {
    Write-Host
	Write-Host "Error: Failed to download the script. The URL might be unreachable." -ForegroundColor Red
    exit 1
}

try {
    Start-Process -FilePath $filename -Wait
    Write-Host
}
catch {
    Write-Host
    Write-Host "Error: Failed to execute the script." -ForegroundColor Red
}

try {
    Remove-Item $filename -Force
    Write-Host
    Write-Host "Temporary file deleted." -ForegroundColor DarkGray
    Write-Host
}
catch {
    Write-Host
    Write-Host "Warning: Temporary file could not be deleted." -ForegroundColor DarkYellow
    Write-Host
}
