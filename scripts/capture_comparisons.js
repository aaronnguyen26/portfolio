const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/98f777d9-9d01-458a-bef0-c24074d8acc7';
const TARGET_URL = 'http://localhost:3000/preview_side_by_side.html';

const COMPARISONS = [
  { id: 'comp-a', filename: 'compare_01_broadside.png' },
  { id: 'comp-b', filename: 'compare_02_field_log.png' },
  { id: 'comp-c', filename: 'compare_03_blueprint.png' },
  { id: 'comp-d', filename: 'compare_04_frontispiece.png' },
  { id: 'comp-e', filename: 'compare_05_bento.png' }
];

async function run() {
  console.log('--- Capturing 5 Direct Comparisons ---');

  try {
    require('child_process').execSync('pkill -f "remote-debugging-port=9245"');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9245',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-comp-' + Date.now(),
    TARGET_URL
  ]);

  let list = null;
  console.log('Waiting for Chrome DevTools on port 9245...');
  for (let i = 0; i < 50; i++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9245/json', res => {
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
          console.log(`Found active page tab on attempt ${i + 1}: ${pageTab.url}`);
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
    width: 1400,
    height: 3600,
    deviceScaleFactor: 2,
    mobile: false
  });

  /* Wait for images to load */
  await new Promise(r => setTimeout(r, 2000));

  for (const item of COMPARISONS) {
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('${item.id}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });

    const rect = evalRes && evalRes.result && evalRes.result.result && evalRes.result.result.value;
    if (rect) {
      console.log(`Capturing ${item.id}: x=${rect.x}, y=${rect.y}, w=${rect.width}, h=${rect.height}`);
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
      const savePath = path.join(ARTIFACT_DIR, item.filename);
      fs.writeFileSync(savePath, Buffer.from(shot.result.data, 'base64'));
      console.log(`Saved: ${item.filename}`);
    } else {
      console.error(`Element #${item.id} not found!`);
    }
  }

  console.log('Finished capturing all 5 comparisons!');
  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
