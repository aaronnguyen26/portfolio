const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/98f777d9-9d01-458a-bef0-c24074d8acc7';
const TARGET_URL = 'http://localhost:3000/projects';

async function run() {
  console.log('--- Capturing Live Mobile Pages for Cohesion Audit ---');

  try {
    require('child_process').execSync('pkill -f "remote-debugging-port=9254"');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9254',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-live-' + Date.now(),
    TARGET_URL
  ]);

  let list = null;
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
        if (pageTab) break;
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
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  async function snap(url, filename, action) {
    console.log(`Navigating to ${url}...`);
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1600));

    if (action) {
      await send('Runtime.evaluate', { expression: action });
      await new Promise(r => setTimeout(r, 500));
    }

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const savePath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(savePath, Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved: ${filename}`);
  }

  // 1. Home page
  await snap('http://localhost:3000/', 'live_cohesion_home.png');

  // 2. Projects page (Notice "Aaron Nguyen" at top-left!)
  await snap('http://localhost:3000/projects', 'live_cohesion_projects.png');

  // 3. Projects page with menu drawer open
  await snap('http://localhost:3000/projects', 'live_cohesion_projects_menu.png', `
    const btn = document.querySelector('.mobile-minimal-brand');
    if (btn) btn.click();
  `);

  console.log('All live cohesion screenshots captured successfully!');
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
