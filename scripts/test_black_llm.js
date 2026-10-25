const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/eeb2bc5a-8362-4010-9f39-293f80bdbbc4';
const PORT = 9299;

async function run() {
  console.log('--- Testing Black llm.txt Viewer ---');

  try {
    execSync(`pkill -f "remote-debugging-port=${PORT}"`);
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-black-txt-' + Date.now(),
    'about:blank'
  ]);

  let list = null;
  for (let i = 0; i < 30; i++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${PORT}/json`, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
          });
        });
        req.on('error', reject);
        req.setTimeout(800, () => req.destroy());
      });
      if (list && list.length > 0) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
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

  // 1. Desktop Test
  console.log('1. Setting desktop metrics (1280 x 900)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 2500));

  console.log('Clicking llm.txt in desktop nav...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const links = Array.from(document.querySelectorAll('header.nav a'));
        const link = links.find(l => l.textContent.includes('llm.txt'));
        if (link) link.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'llm_black_txt_desktop.png'), Buffer.from(shotDesktop.result.data, 'base64'));
  console.log('Saved: llm_black_txt_desktop.png');

  // Close desktop
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.llm-viewer-close-btn').click()`
  });
  await new Promise(r => setTimeout(r, 400));

  // 2. Mobile Test
  console.log('2. Setting mobile metrics (390 x 844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
    hasTouch: true
  });
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Opening mobile drawer...');
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.mobile-minimal-brand').click()`
  });
  await new Promise(r => setTimeout(r, 500));

  const shotDrawer = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'mobile_drawer_clean_llm.png'), Buffer.from(shotDrawer.result.data, 'base64'));
  console.log('Saved: mobile_drawer_clean_llm.png');

  console.log('Clicking 07 llm.txt in mobile drawer...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.mobile-home-nav-link'));
        const btn = btns.find(b => b.textContent.includes('llm.txt'));
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'llm_black_txt_mobile.png'), Buffer.from(shotMobile.result.data, 'base64'));
  console.log('Saved: llm_black_txt_mobile.png');

  ws.close();
  chromeProc.kill();
  console.log('Done!');
}

run().catch(console.error);
