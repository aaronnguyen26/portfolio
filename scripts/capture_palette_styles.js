const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/98f777d9-9d01-458a-bef0-c24074d8acc7';
const TARGET_URL = 'http://localhost:3000/preview_5_styles_palette.html';

const STYLES = [
  { id: 'screen-a', filename: 'style_a_typographic_broadside.png' },
  { id: 'screen-b', filename: 'style_b_chronological_field_log.png' },
  { id: 'screen-c', filename: 'style_c_systems_blueprint.png' },
  { id: 'screen-d', filename: 'style_d_literary_frontispiece.png' },
  { id: 'screen-e', filename: 'style_e_tactile_bento_docket.png' }
];

async function run() {
  console.log('--- Starting Palette Styles Screen Capture ---');

  try {
    require('child_process').execSync('pkill -f "remote-debugging-port=9240"');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9240',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-pal-fresh-' + Date.now(),
    TARGET_URL
  ]);

  let list = null;
  console.log('Waiting for Chrome DevTools on port 9240...');
  for (let i = 0; i < 50; i++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9240/json', res => {
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

  /* Set broad viewport to fit all 5 phones side-by-side */
  await send('Emulation.setDeviceMetricsOverride', {
    width: 2500,
    height: 1200,
    deviceScaleFactor: 2,
    mobile: false
  });

  /* Poll until DOM has loaded the 5 phone mockups */
  let ready = false;
  for (let i = 0; i < 40; i++) {
    const res = await send('Runtime.evaluate', {
      expression: 'document.querySelectorAll(".phone-device").length',
      returnByValue: true
    });
    const count = res && res.result && res.result.result && res.result.result.value;
    if (count >= 5) {
      console.log(`DOM ready! Found ${count} phones.`);
      ready = true;
      break;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  if (!ready) {
    throw new Error('DOM did not render 5 phones');
  }

  /* Wait for fonts to settle */
  await new Promise(r => setTimeout(r, 1200));

  /* Capture individual phone elements using DOM bounding boxes */
  for (const style of STYLES) {
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('${style.id}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });

    const rect = evalRes && evalRes.result && evalRes.result.result && evalRes.result.result.value;
    if (rect) {
      console.log(`Capturing ${style.id}: x=${rect.x}, y=${rect.y}, w=${rect.width}, h=${rect.height}`);
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
      const savePath = path.join(ARTIFACT_DIR, style.filename);
      fs.writeFileSync(savePath, Buffer.from(shot.result.data, 'base64'));
      console.log(`Saved: ${style.filename}`);
    } else {
      console.error(`Element #${style.id} not found!`);
    }
  }

  /* Also capture a panoramic overview banner showing all 5 styles side by side */
  const gridEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.showcase-grid');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    })()`,
    returnByValue: true
  });
  const r = gridEval && gridEval.result && gridEval.result.result && gridEval.result.result.value;
  if (r) {
    const shotAll = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height), scale: 1 }
    });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_5_styles_panorama.png'), Buffer.from(shotAll.result.data, 'base64'));
    console.log('Saved: preview_5_styles_panorama.png');
  }

  console.log('Done capturing all 5 palette styles!');
  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
