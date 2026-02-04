# TLS 1.2 (PowerShell 2.0 uyumlu)
try {
    $tls12 = [Enum]::ToObject([Net.SecurityProtocolType], 3072)
    [Net.ServicePointManager]::SecurityProtocol =
        [Net.ServicePointManager]::SecurityProtocol -bor $tls12
} catch {
    try {
        [Net.ServicePointManager]::SecurityProtocol =
            [Net.ServicePointManager]::SecurityProtocol.value__ -bor 3072
    } catch {}
}

# Bilgi
Write-Host ''
Write-Host 'https://erturk.netlify.app' -ForegroundColor Green
Write-Host 'https://github.com/abdullah-erturk/scan_repair_windows' -ForegroundColor Green
Write-Host ''

# Dil tespiti
$culture = 'en-US'
try {
    $culture = (Get-UICulture).Name
} catch {
    try {
        $lcid = (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Nls\Language').Default
        $culture = [System.Globalization.CultureInfo]::GetCultureInfo([int]$lcid).Name
    } catch {}
}

# İndirilecek dosya
$url = 'https://raw.githubusercontent.com/abdullah-erturk/scan_repair_windows/main/check.bat'

if ($culture -like 'tr-*') {
    Write-Host 'Turkish system detected.' -ForegroundColor Cyan
} else {
    Write-Host 'Non-Turkish system detected.' -ForegroundColor Yellow
}

# Geçici dosya
$guid = [guid]::NewGuid().ToString('N')
$file = "$env:TEMP\check_$guid.bat"

try {
    $wc = New-Object Net.WebClient
    $wc.DownloadFile($url, $file)
    $wc.Dispose()
    Write-Host "Downloaded: $file" -ForegroundColor Green
} catch {
    Write-Host 'Download failed.' -ForegroundColor Red
    exit 1
}

# Çalıştır
try {
    Start-Process cmd.exe -ArgumentList "/c", $file -Wait
} catch {
    Write-Host 'Execution failed.' -ForegroundColor Red
}

# Temizlik
try {
    Remove-Item $file -Force
} catch {}
