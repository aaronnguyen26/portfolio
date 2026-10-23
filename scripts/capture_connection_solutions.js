const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/98f777d9-9d01-458a-bef0-c24074d8acc7';
const TARGET_URL = 'http://localhost:3000/preview_connection_solutions.html';

async function run() {
  console.log('--- Capturing 3 Connection Solutions Mockups ---');

  try {
    require('child_process').execSync('pkill -f "remote-debugging-port=9254"');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9254',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-conn-' + Date.now(),
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

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.addEventListener('open', r));

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 2400,
    height: 1400,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Wait for Google fonts to settle
  await new Promise(r => setTimeout(r, 2500));

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

  // 1. Solution 1 individual frame
  await captureElement('frame-s1', 'solution_01_sticky_header_gateway.png');

  // 2. Solution 2 individual frame
  await captureElement('frame-s2', 'solution_02_quick_jump_fork.png');

  // 3. Solution 3 individual frame
  await captureElement('frame-s3', 'solution_03_floating_bottom_dock.png');

  // 4. Full Panorama containing all 3
  await captureElement('showcase-stage', 'solution_panorama_3_options.png');

  console.log('All connection solution screenshots captured!');
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
