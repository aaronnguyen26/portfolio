const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/98f777d9-9d01-458a-bef0-c24074d8acc7';
const TARGET_URL = 'http://localhost:3000/preview_minimal_portal.html';

async function run() {
  console.log('--- Capturing Minimalist Hero & Exploration Portal Views ---');

  try {
    require('child_process').execSync('pkill -f "remote-debugging-port=9254"');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9254',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-portal-' + Date.now(),
    TARGET_URL
  ]);

  let list = null;
  console.log('Waiting for Chrome DevTools on port 9254...');
  for (let i = 0; i < 50; i++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9254/json', res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
          });
        });
        req.on('error', reject);
        req.setTimeout(800, () => req.destroy());
      });
      if (list && list.length > 0) {
        const pageTab = list.find(t => t.type === 'page' && !t.url.startsWith('chrome://'));
        if (pageTab) {
          console.log(`Connected to page on attempt ${i + 1}: ${pageTab.url}`);
          break;
        }
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 250));
    }
  }

  const pageTab = list && list.find(t => t.type === 'page' && !t.url.startsWith('chrome://'));
  if (!pageTab) {
    chromeProc.kill();
    throw new Error('Could not find active webpage tab');
  }

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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 2400,
    height: 1300,
    deviceScaleFactor: 2,
    mobile: false
  });

  /* Wait for fonts to settle */
  await new Promise(r => setTimeout(r, 2200));

  async function captureElement(elementId, filename) {
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('${elementId}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });

    const rect = evalRes && evalRes.result && evalRes.result.result && evalRes.result.result.value;
    if (rect) {
      console.log(`Capturing #${elementId}: x=${rect.x}, y=${rect.y}, w=${rect.width}, h=${rect.height}`);
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          scale: 1
        }
      });
      const savePath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(savePath, Buffer.from(shot.result.data, 'base64'));
      console.log(`Saved: ${filename}`);
    } else {
      console.error(`Element #${elementId} not found!`);
    }
  }

  /* 1. Master Journey: Clean Hero on Left -> Options Revealed on Right */
  await send('Runtime.evaluate', { expression: `switchView('journey');` });
  await new Promise(r => setTimeout(r, 600));
  await captureElement('container-journey', 'portal_master_journey.png');

  /* 2. Single Clean Hero */
  await captureElement('frame-clean-hero', 'portal_clean_hero.png');

  /* 3. Option 01: Editorial Chapter Tiles (Scrolled) */
  await send('Runtime.evaluate', {
    expression: `
      switchView('style-1');
      document.getElementById('scroll-opt-1').style.scrollBehavior = 'auto';
      document.getElementById('scroll-opt-1').scrollTop = 824;
    `
  });
  await new Promise(r => setTimeout(r, 600));
  await captureElement('frame-opt-1', 'portal_01_chapter_tiles.png');

  /* 4. Option 02: Typographic Ledger (Scrolled) */
  await send('Runtime.evaluate', {
    expression: `
      switchView('style-2');
      document.getElementById('scroll-opt-2').style.scrollBehavior = 'auto';
      document.getElementById('scroll-opt-2').scrollTop = 824;
    `
  });
  await new Promise(r => setTimeout(r, 600));
  await captureElement('frame-opt-2', 'portal_02_ledger.png');

  /* 5. Option 03: Tactile Bento Deck (Scrolled) */
  await send('Runtime.evaluate', {
    expression: `
      switchView('style-3');
      document.getElementById('scroll-opt-3').style.scrollBehavior = 'auto';
      document.getElementById('scroll-opt-3').scrollTop = 824;
    `
  });
  await new Promise(r => setTimeout(r, 600));
  await captureElement('frame-opt-3', 'portal_03_bento.png');

  /* 6. Compare All 3 Options Below Side-by-Side */
  await send('Runtime.evaluate', {
    expression: `
      switchView('all');
      document.getElementById('scroll-opt-1').style.scrollBehavior = 'auto';
      document.getElementById('scroll-opt-2').style.scrollBehavior = 'auto';
      document.getElementById('scroll-opt-3').style.scrollBehavior = 'auto';
      document.getElementById('scroll-opt-1').scrollTop = 824;
      document.getElementById('scroll-opt-2').scrollTop = 824;
      document.getElementById('scroll-opt-3').scrollTop = 824;
    `
  });
  await new Promise(r => setTimeout(r, 800));
  await captureElement('showcase-stage', 'portal_panorama_3_options.png');

  console.log('All portal views captured successfully!');
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
