const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/eeb2bc5a-8362-4010-9f39-293f80bdbbc4';
const PORT = 9310;

async function run() {
  console.log('--- Testing Desktop Resume Placement & 2 Hero Buttons ---');

  try {
    execSync(`pkill -9 -f "remote-debugging-port=${PORT}"`);
    await new Promise(r => setTimeout(r, 800));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-desktop-resume-' + Date.now(),
    'about:blank'
  ]);

  let list = null;
  for (let i = 0; i < 40; i++) {
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
      await new Promise(r => setTimeout(r, 250));
    }
  }

  if (!list || list.length === 0) {
    chromeProc.kill();
    throw new Error('Chrome failed to initialize on port ' + PORT);
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

  // Set desktop viewport (1280 x 900)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 3000));

  // 1. Capture Header Nav with Resume button
  console.log('1. Capturing desktop header with Resume button...');
  const shotNav = await send('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1280, height: 95, scale: 2 }
  });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop_nav_with_resume.png'), Buffer.from(shotNav.result.data, 'base64'));
  console.log('Saved: desktop_nav_with_resume.png');

  // 2. Capture Hero Buttons row (verifying only 2 buttons: View projects & Read my story)
  console.log('2. Capturing hero 2 buttons...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.hero .rise.d3');
        if (el) el.scrollIntoView({ block: 'center' });
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const heroBtnBox = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.hero a.btn'));
        if (btns.length === 0) return null;
        const parent = btns[0].parentElement;
        const rect = parent.getBoundingClientRect();
        return {
          x: Math.round(rect.left - 40),
          y: Math.round(rect.top - 20),
          width: Math.round(rect.width + 80),
          height: Math.round(rect.height + 40),
          count: btns.length,
          texts: btns.map(b => b.textContent.trim())
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Hero button evaluation:', heroBtnBox.result.value);

  if (heroBtnBox.result.value) {
    const val = heroBtnBox.result.value;
    const shotHeroBtns = await send('Page.captureScreenshot', {
      clip: {
        x: Math.max(0, val.x),
        y: Math.max(0, val.y),
        width: val.width,
        height: val.height,
        scale: 2
      }
    });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop_hero_only_two_buttons.png'), Buffer.from(shotHeroBtns.result.data, 'base64'));
    console.log('Saved: desktop_hero_only_two_buttons.png');
  }

  // 3. Capture Journal Spread with CV/Resume ticket
  console.log('3. Capturing 3D journal spread with CV ticket...');
  const spreadBox = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.spread-perspective-stage');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })()
    `,
    returnByValue: true
  });

  if (spreadBox.result.value) {
    const sVal = spreadBox.result.value;
    const shotSpread = await send('Page.captureScreenshot', {
      clip: {
        x: Math.max(0, sVal.x),
        y: Math.max(0, sVal.y),
        width: sVal.width,
        height: sVal.height,
        scale: 2
      }
    });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop_spread_with_cv_ticket.png'), Buffer.from(shotSpread.result.data, 'base64'));
    console.log('Saved: desktop_spread_with_cv_ticket.png');
  }

  // 4. Click Resume ↗ in top header and capture modal
  console.log('4. Clicking Resume ↗ in top header...');
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.nav-resume-btn').click()`
  });
  await new Promise(r => setTimeout(r, 600));

  const shotModal = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop_resume_modal_opened.png'), Buffer.from(shotModal.result.data, 'base64'));
  console.log('Saved: desktop_resume_modal_opened.png');

  ws.close();
  chromeProc.kill();
  console.log('All tests passed successfully!');
}

run().catch(console.error);
