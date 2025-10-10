// netlify/functions/run.js
exports.handler = async function (event) {
  // pmasdownload.ps1 içeriği - buraya tam olarak yapıştırıldı
  const psContent = `# This code downloads the script file for the Turkish or English PMAS v5 [Powershell Multi Activation System] application from the Github site, depending on the operating system language.

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

$filename = "$env:TEMP\\pmas.bat"

try {
    Invoke-WebRequest -Uri $url -OutFile $filename -UseBasicParsing
    Write-Host
    Write-Host "Script downloaded: $filename" -ForegroundColor Green
}
catch {
    Write-Host
\tWrite-Host "Error: Failed to download the script. The URL might be unreachable." -ForegroundColor Red
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
  // Basit HTML içeriği (tarayıcılar için)
  const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>erturk</title>
</head>
<body>
<section style="font-family: Consolas, monospace; background: #1e1e1e; color: #e4e4e4; padding: 20px; border-radius: 10px; max-width: 800px; margin: 40px auto;">
   <h2>Windows ve Office ürünlerini etkinleştirmek için Powershell Multi Activation System çalıştırılabilir durumda</h2>
   <p></p>
   <h2 style="color: #4fc3f7;">💻 PowerShell Komut Satırı Üzerinden Çalıştırmak İçin:</h2>
  <ol style="margin-left: 20px;">
    <li>PowerShell'i açın.<br>
      <small>(Bunu yapmak için <strong>Windows tuşu + X</strong> tuşlarına basın ve ardından <strong>PowerShell</strong> veya <strong>Terminal</strong> seçeneğini tıklayın.)</small>
    </li>
    <li>Aşağıdaki komutu kopyalayıp yapıştırın ve <strong>Enter</strong> tuşuna basın:</li>
  </ol>
  <pre style="background: #2d2d2d; color: #00e676; padding: 12px; border-radius: 8px; overflow-x: auto;">irm erturk.netlify.app/run | iex</pre>
</section>
</body>
</html>`;

  const ua = (event.headers['user-agent'] || '').toLowerCase();

  // PowerShell user-agent'ı tespiti
  if (ua.includes('powershell') || ua.includes('windows-powershell')) {
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
