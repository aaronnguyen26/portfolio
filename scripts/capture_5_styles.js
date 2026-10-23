const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/98f777d9-9d01-458a-bef0-c24074d8acc7';
const HTML_FILE = path.join(ARTIFACT_DIR, 'home_page_5_styles_showcase.html');
const FILE_URL = 'file://' + HTML_FILE;

const STYLES = [
  { id: 'swiss', filename: 'style_01_swiss_ledger' },
  { id: 'terminal', filename: 'style_02_quant_terminal' },
  { id: 'blueprint', filename: 'style_03_systems_blueprint' },
  { id: 'magazine', filename: 'style_04_kinetic_magazine' },
  { id: 'bento', filename: 'style_05_spatial_bento' }
];

async function run() {
  console.log('--- Capturing 5 Distinct Home Page Styles ---');

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-styles-' + Date.now(),
    'about:blank'
  ]);

  let list = null;
  for (let i = 0; i < 25; i++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9227/json', res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
          });
        });
        req.on('error', reject);
      });
      if (list && list.length > 0) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!list || list.length === 0) {
    chromeProc.kill();
    throw new Error('Chrome did not respond on 9227');
  }

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
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to showcase HTML...');
  await send('Page.navigate', { url: FILE_URL });
  await new Promise(r => setTimeout(r, 2000));

  for (const style of STYLES) {
    console.log(`Processing Style: ${style.id}...`);

    /* 1. Switch to this style */
    await send('Runtime.evaluate', {
      expression: `switchStyle('${style.id}'); setViewport('desktop');`
    });
    await new Promise(r => setTimeout(r, 400));

    /* DESKTOP CAPTURE */
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 400));

    const shotDesktop = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
    const deskPath = path.join(ARTIFACT_DIR, `${style.filename}_desktop.png`);
    fs.writeFileSync(deskPath, Buffer.from(shotDesktop.result.data, 'base64'));
    console.log(`Saved: ${style.filename}_desktop.png`);

    /* MOBILE CAPTURE */
    await send('Runtime.evaluate', {
      expression: `setViewport('mobile');`
    });
    await send('Emulation.setDeviceMetricsOverride', {
      width: 500,
      height: 960,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 400));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
    const mobPath = path.join(ARTIFACT_DIR, `${style.filename}_mobile.png`);
    fs.writeFileSync(mobPath, Buffer.from(shotMobile.result.data, 'base64'));
    console.log(`Saved: ${style.filename}_mobile.png`);
  }

  console.log('All 10 screenshots generated successfully!');
  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
