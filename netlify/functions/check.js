exports.handler = async function () {

    const psScript = `# This code downloads the script file for the Turkish or English Windows Scan / Repair File.

try {
    $tls12 = [Enum]::ToObject([Net.SecurityProtocolType], 3072)
    [Net.ServicePointManager]::SecurityProtocol =
        [Net.ServicePointManager]::SecurityProtocol -bor $tls12
} catch {
    try {
        $current = [Net.ServicePointManager]::SecurityProtocol.value__
        [Net.ServicePointManager]::SecurityProtocol = $current -bor 3072
    } catch {}
}

if (-not $args) {
    Write-Host ''
    Write-Host 'https://erturk.netlify.app' -ForegroundColor Green
    Write-Host 'https://erturk.netlify.app/run' -ForegroundColor Green
    Write-Host 'https://github.com/abdullah-erturk/scan_repair_windows' -ForegroundColor Green
    Write-Host ''
}

$culture = $null
try {
    $culture = (Get-UICulture).Name
} catch {
    try {
        $lcid = (Get-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Nls\\Language').Default
        $culture = [System.Globalization.CultureInfo]::GetCultureInfo([int]$lcid).Name
    } catch {
        $culture = 'en-US'
    }
}

$url = 'https://raw.githubusercontent.com/abdullah-erturk/scan_repair_windows/refs/heads/main/check.bat'

if ($culture -like 'tr-*') {
    Write-Host 'Turkish system detected. Downloading script...' -ForegroundColor Cyan
} else {
    Write-Host 'Non-Turkish system detected. Downloading script...' -ForegroundColor Yellow
}

$guid = [guid]::NewGuid().ToString('N')
$filename = "$env:TEMP\\check_$guid.bat"

try {
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($url, $filename)
    $wc.Dispose()
    Write-Host "Script downloaded: $filename" -ForegroundColor Green
} catch {
    Write-Host 'Download failed.' -ForegroundColor Red
    exit 1
}

try {
    Start-Process cmd.exe -ArgumentList "/c", $filename -Wait
} catch {
    Write-Host 'Execution failed.' -ForegroundColor Red
}

try {
    Remove-Item $filename -Force
    Write-Host 'Temporary file deleted.'
} catch {}
`;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        },
        body: psScript
    };
};
