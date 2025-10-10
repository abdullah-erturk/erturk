const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const psPath = path.join(__dirname, '..', '..', 'pmas.ps1');
  const htmlPath = path.join(__dirname, '..', '..', 'index.html');

  const psContent = fs.existsSync(psPath) ? fs.readFileSync(psPath, 'utf8') : 'PS script not found';
  const htmlContent = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '<html><body><h1>Site Açıldı</h1></body></html>';

  const ua = (event.headers['user-agent'] || '').toLowerCase();
  const isPS = ua.includes('powershell') || ua.includes('windows-powershell');

  if (isPS) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
      body: psContent
    };
  } else {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlContent
    };
  }
};
