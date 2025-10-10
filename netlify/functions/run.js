const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const psPath = path.join(__dirname, '..', '..', 'public', 'pmas.ps1');
    const htmlPath = path.join(__dirname, '..', '..', 'public', 'index.html');

    if (!fs.existsSync(psPath)) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'pmas.ps1 not found'
      };
    }

    const psContent = fs.readFileSync(psPath, { encoding: 'utf8' });
    const indexHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, { encoding: 'utf8' }) : '<html><body><h1>Welcome</h1></body></html>';

    const ua = (event.headers['user-agent'] || event.headers['User-Agent'] || '').toLowerCase();
    const accept = (event.headers['accept'] || '').toLowerCase();
    const xps = (event.headers['x-ps-request'] || '').toLowerCase();

    const looksLikePowerShell = ua.includes('powershell') || ua.includes('windows-powershell') || accept.includes('text/plain') || xps === '1';

    if (looksLikePowerShell) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Content-Type-Options': 'nosniff'
        },
        body: psContent
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        },
        body: indexHtml
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Server error: ' + String(err)
    };
  }
};