const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/eeb2bc5a-8362-4010-9f39-293f80bdbbc4';
const PORT = 9295;

async function runTest() {
  console.log('--- Starting LLM Modal & UI Verification Audit ---');

  try {
    execSync(`pkill -f "remote-debugging-port=${PORT}"`);
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {}

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-browser-llm-' + Date.now(),
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

  // ==================== PART 1: DESKTOP AUDIT ====================
  console.log('1. Setting desktop metrics (1280 x 900)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log('Navigating to http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 2500));

  // Click llms.txt in desktop nav
  console.log('2. Clicking "llms.txt" in top desktop navigation...');
  const openResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const links = Array.from(document.querySelectorAll('header.nav a, header.nav button'));
        const llmLink = links.find(el => el.textContent.includes('llms.txt'));
        if (llmLink) {
          llmLink.click();
          return { success: true, text: llmLink.textContent };
        }
        return { success: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Desktop click result:', openResult.result.value);
  await new Promise(r => setTimeout(r, 600));

  // Capture Overview Tab
  const shotOverview = await send('Page.captureScreenshot', { format: 'png' });
  const overviewPath = path.join(ARTIFACT_DIR, 'llm_modal_overview_desktop.png');
  fs.writeFileSync(overviewPath, Buffer.from(shotOverview.result.data, 'base64'));
  console.log('Saved: llm_modal_overview_desktop.png');

  // Switch to Preview Tab
  console.log('3. Clicking "Preview Markdown" tab...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const tabs = Array.from(document.querySelectorAll('.llm-tab-btn'));
        const previewTab = tabs.find(t => t.textContent.includes('Preview'));
        if (previewTab) previewTab.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const shotPreview = await send('Page.captureScreenshot', { format: 'png' });
  const previewPath = path.join(ARTIFACT_DIR, 'llm_modal_preview_desktop.png');
  fs.writeFileSync(previewPath, Buffer.from(shotPreview.result.data, 'base64'));
  console.log('Saved: llm_modal_preview_desktop.png');

  // Switch to Config Tab
  console.log('4. Clicking "How to Configure" tab...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const tabs = Array.from(document.querySelectorAll('.llm-tab-btn'));
        const configTab = tabs.find(t => t.textContent.includes('Configure'));
        if (configTab) configTab.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const shotConfig = await send('Page.captureScreenshot', { format: 'png' });
  const configPath = path.join(ARTIFACT_DIR, 'llm_modal_config_desktop.png');
  fs.writeFileSync(configPath, Buffer.from(shotConfig.result.data, 'base64'));
  console.log('Saved: llm_modal_config_desktop.png');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = document.querySelector('.llm-close-btn');
        if (closeBtn) closeBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // ==================== PART 2: MOBILE AUDIT ====================
  console.log('5. Setting mobile metrics (390 x 844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
    hasTouch: true
  });

  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 2000));

  // Open mobile drawer
  console.log('6. Opening mobile drawer menu...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const brandBtn = document.querySelector('.mobile-minimal-brand');
        if (brandBtn) brandBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // Click 07 / AI Index (llms.txt)
  console.log('7. Clicking "07 / AI Index (llms.txt)" in mobile drawer...');
  const mobileMenuClick = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const items = Array.from(document.querySelectorAll('.mobile-home-nav-link'));
        const aiItem = items.find(el => el.textContent.includes('AI Index') || el.textContent.includes('llms.txt'));
        if (aiItem) {
          aiItem.click();
          return { success: true };
        }
        return { success: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Mobile menu click result:', mobileMenuClick.result.value);
  await new Promise(r => setTimeout(r, 600));

  const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
  const mobilePath = path.join(ARTIFACT_DIR, 'llm_modal_mobile.png');
  fs.writeFileSync(mobilePath, Buffer.from(shotMobile.result.data, 'base64'));
  console.log('Saved: llm_modal_mobile.png');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = document.querySelector('.llm-close-btn');
        if (closeBtn) closeBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // Test mobile footer link
  console.log('8. Scrolling to bottom of mobile page and clicking footer llms.txt link...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.scrollTo(0, document.body.scrollHeight);
        const footerBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('llms.txt'));
        if (footerBtn) {
          footerBtn.click();
          return { success: true };
        }
        return { success: false };
      })()
    `,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 600));

  const shotMobileFooter = await send('Page.captureScreenshot', { format: 'png' });
  const mobileFooterPath = path.join(ARTIFACT_DIR, 'llm_modal_mobile_from_footer.png');
  fs.writeFileSync(mobileFooterPath, Buffer.from(shotMobileFooter.result.data, 'base64'));
  console.log('Saved: llm_modal_mobile_from_footer.png');

  ws.close();
  chromeProc.kill();
  console.log('--- LLM Modal & UI Verification Complete! ---');
}

runTest().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
