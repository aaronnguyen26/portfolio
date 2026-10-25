const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/eeb2bc5a-8362-4010-9f39-293f80bdbbc4';
const PORT = 9290;

async function runTest() {
  console.log('--- Starting Browser-Style Resume Viewer Audit ---');

  try {
    execSync(`pkill -f "remote-debugging-port=${PORT}"`);
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-browser-resume-' + Date.now(),
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

  if (!list || list.length === 0) {
    chromeProc.kill();
    throw new Error('Chrome did not respond on port ' + PORT);
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

  // 1. Mobile viewport (iPhone 15: 390 x 844)
  console.log('1. Setting mobile metrics (390 x 844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
    hasTouch: true
  });

  console.log('Navigating to http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 2500));

  // 2. Click top-right Resume button
  console.log('2. Clicking top-right Resume button on mobile...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const topbar = document.querySelector('.mobile-minimal-topbar');
        const btns = Array.from(topbar.querySelectorAll('button, a'));
        const resumeBtn = btns.find(b => b.textContent.includes('Resume'));
        if (resumeBtn) resumeBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. Click "View on Screen"
  console.log('3. Clicking "View on Screen"...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const screenBtn = document.querySelector('.resume-option-card-screen');
        if (screenBtn) screenBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // Capture State: Mobile Browser-Style Viewer
  const shotViewerMobile = await send('Page.captureScreenshot', { format: 'png' });
  const viewerMobilePath = path.join(ARTIFACT_DIR, 'resume_browser_viewer_mobile.png');
  fs.writeFileSync(viewerMobilePath, Buffer.from(shotViewerMobile.result.data, 'base64'));
  console.log('Saved: resume_browser_viewer_mobile.png');

  // 4. Test zoom in
  console.log('4. Testing Zoom In (+) on browser pill...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const pillBtns = Array.from(document.querySelectorAll('.resume-zoom-pill-btn'));
        if (pillBtns.length >= 2) pillBtns[1].click(); // '+' button
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const shotZoomed = await send('Page.captureScreenshot', { format: 'png' });
  const zoomedPath = path.join(ARTIFACT_DIR, 'resume_browser_viewer_zoomed.png');
  fs.writeFileSync(zoomedPath, Buffer.from(shotZoomed.result.data, 'base64'));
  console.log('Saved: resume_browser_viewer_zoomed.png');

  // 5. Test close
  console.log('5. Clicking Close (✕)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = document.querySelector('.resume-tool-close-btn');
        if (closeBtn) closeBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // 6. Desktop Audit (1200 x 800)
  console.log('6. Testing Desktop view (1200 x 800)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false,
    hasTouch: false
  });
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 1500));

  // Open resume on desktop and switch to viewer
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const links = Array.from(document.querySelectorAll('a'));
        const resumeLink = links.find(l => l.textContent.includes('Resume'));
        if (resumeLink) resumeLink.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const screenBtn = document.querySelector('.resume-option-card-screen');
        if (screenBtn) screenBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
  const desktopPath = path.join(ARTIFACT_DIR, 'resume_browser_viewer_desktop.png');
  fs.writeFileSync(desktopPath, Buffer.from(shotDesktop.result.data, 'base64'));
  console.log('Saved: resume_browser_viewer_desktop.png');

  ws.close();
  chromeProc.kill();
  console.log('--- Test Finished Successfully! ---');
}

runTest().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
