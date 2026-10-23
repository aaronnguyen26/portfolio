const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const url = process.argv[2] || 'http://localhost:3000/contact';
  const outPath = process.argv[3] || 'mobile_snap.png';
  const screenWidth = parseInt(process.argv[4] || '430', 10);
  const screenHeight = parseInt(process.argv[5] || '932', 10);
  const clickSelector = process.argv[6] || null;

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-test-profile-' + Date.now(),
    'about:blank'
  ]);

  let list = null;
  for (let attempt = 0; attempt < 25; attempt++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9224/json', res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(null);
            }
          });
        });
        req.on('error', reject);
        req.setTimeout(800, () => req.destroy());
      });
      if (list && list.length > 0) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  if (!list || list.length === 0) {
    chromeProc.kill();
    throw new Error('Chrome did not respond on debugging port 9224');
  }

  try {
    const pageTab = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const resolve = pending.get(msg.id);
        pending.delete(msg.id);
        resolve(msg);
      }
    };

    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = id++;
      pending.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await new Promise(r => ws.onopen = r);

    // Set mobile device metrics
    await send('Emulation.setDeviceMetricsOverride', {
      width: screenWidth,
      height: screenHeight,
      deviceScaleFactor: 2,
      mobile: true,
      screenWidth: screenWidth,
      screenHeight: screenHeight
    });

    await send('Emulation.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });

    await send('Page.enable');
    await send('Page.navigate', { url });

    // Wait for page load and hydration
    await new Promise(r => setTimeout(r, 2000));

    // Evaluate layout widths
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        JSON.stringify({
          windowWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          wrap: document.querySelector('.wrap') ? document.querySelector('.wrap').getBoundingClientRect() : null,
          card: document.querySelector('.mobile-contact-card') ? document.querySelector('.mobile-contact-card').getBoundingClientRect() : null,
          tiles: document.querySelector('.mobile-contact-tiles-grid') ? document.querySelector('.mobile-contact-tiles-grid').getBoundingClientRect() : null,
        })
      `
    });

    console.log('Layout diagnostics:', evalRes.result.value);

    if (clickSelector) {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector(${JSON.stringify(clickSelector)});
          if (el) el.click();
        `
      });
      await new Promise(r => setTimeout(r, 800));
    }

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });

    fs.writeFileSync(outPath, Buffer.from(shot.result.data, 'base64'));
    console.log('Screenshot saved to:', outPath);

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
