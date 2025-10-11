// netlify/functions/run.js
exports.handler = async function (event) {
  // PMAS PowerShell scripti - TLS 1.2 ve dil algılama + tüm PowerShell user-agent’ları
  const psContent = `# PMAS v5 - Automatic TLS 1.2 Support + Language Detection Downloader
# ----------------------------------------------------------
# This script downloads the Turkish or English PMAS v5 [Powershell Multi Activation System]
# depending on the system language, and ensures TLS 1.2 is enabled for secure HTTPS connections.

# --- Enable TLS 1.2 for secure HTTPS connections ---
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Write-Host "TLS 1.2 enabled successfully." -ForegroundColor Green
} catch {
    Write-Host "Could not enable TLS 1.2, attempting anyway..." -ForegroundColor Yellow
}

# --- Detect system language ---
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

$filename = "$env:TEMP\\pmas.bat"

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
}`;

  // Basit HTML içeriği (tarayıcılar için) - değişmedi
  const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PMAS</title>
</head>
<body>
<section style="font-family: Consolas, monospace; background: #1e1e1e; color: #e4e4e4; padding: 20px; border-radius: 10px; max-width: 950px; margin: 40px auto;">
  <h3>TR: <br> Windows ve Office ürünlerini etkinleştirmek için PowerShell Multi Activation System hazır.</h3>
  <h3>EN: <br> PowerShell Multi Activation System is ready to activate Windows and Office products.</h3>
  <hr style="border: 1px solid #333; margin: 20px 0;">

  <h3 style="color: #4fc3f7;">💻 TR -> PowerShell Komut Satırı Üzerinden Çalıştırmak İçin:</h3>
  <h3 style="color: #4fc3f7;">💻 EN -> To Run via PowerShell Command Line:</h3>

  <ol style="margin-left: 20px;">
    <li>TR -> PowerShell'i açın. (Minimum Powershell versiyonu: 5.0/5.1)
      <small><br>(Bunu yapmak için <strong>Windows tuşu + X</strong> tuşlarına basın ve ardından <strong>PowerShell</strong> veya <strong>Terminal</strong> seçeneğini tıklayın.)</small><br>
        EN -> Open PowerShell. (Minimum Powershell version: 5.0/5.1)
      <small><br>(To do this, press <strong>Windows key + X</strong> and select <strong>PowerShell</strong> or <strong>Terminal</strong>.)</small><br><br>
    </li>
    <li> TR -> Aşağıdaki komutu kopyalayıp yapıştırın ve <strong>Enter</strong> tuşuna basın:<br>
         EN -> Copy and paste the command below and press <strong>Enter</strong>:
    </li>
  </ol>

  <pre style="background: #2d2d2d; color: #00e676; padding: 12px; border-radius: 8px; overflow-x: auto;">irm erturk.netlify.app/run | iex</pre>

  <small>TR -> Powershell sürümünüz 5.0'dan düşükse TLS 1.2 bağlantı hatası ile karşılaşabilirsiniz.. </small><br>
  <small>EN -> If your Powershell version is lower than 5.0, you may encounter a TLS 1.2 connection error.. </small>
  <p></p>
  <li>TR -> Eğer TLS 1.2 hatası alırsanız aşağıdaki komutu kullanın:</li>
  <li>EN -> If you get a TLS 1.2 error, use the command below instead:</li>

  <pre style="background: #2d2d2d; color: #00e676; padding: 12px; border-radius: 8px; overflow-x: auto;">[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; irm erturk.netlify.app/run | iex</pre>
</section>
</body>
</html>`;

  const ua = (event.headers['user-agent'] || '').toLowerCase();

  // PowerShell user-agent'ı tespiti (tüm sürümler)
  const isPowershell = ua.includes('powershell') || ua.includes('windows-powershell') || ua.includes('pwsh');

  if (isPowershell) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      },
      body: psContent
    };
  }

  // Diğer (tarayıcı vb.) -> HTML döndür
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    },
    body: htmlContent
  };
};
