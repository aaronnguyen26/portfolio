const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/minhnguyen/.gemini/antigravity/brain/98f777d9-9d01-458a-bef0-c24074d8acc7';

async function runAudit() {
  console.log('--- Starting Mobile UI/UX Audit Suite ---');

  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-audit-profile-' + Date.now(),
    'about:blank'
  ]);

  let list = null;
  for (let attempt = 0; attempt < 25; attempt++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9225/json', res => {
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
      await new Promise(r => setTimeout(r, 300));
    }
  }

  if (!list || list.length === 0) {
    chromeProc.kill();
    throw new Error('Chrome did not respond on debugging port 9225');
  }

  const results = {
    timestamp: new Date().toISOString(),
    pages: [],
    overflowBugs: [],
    touchTargetIssues: [],
    consoleErrors: []
  };

  try {
    const pageTab = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map(a => a.value || a.description).join(' ');
        if (msg.params.type === 'error') {
          results.consoleErrors.push({ type: 'console.error', text: args });
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        results.consoleErrors.push({
          type: 'exception',
          text: msg.params.exceptionDetails.text,
          url: msg.params.exceptionDetails.url
        });
      }
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
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Log.enable');

    const testRoutes = [
      { name: 'home', url: 'http://localhost:3000/' },
      { name: 'about', url: 'http://localhost:3000/about' },
      { name: 'projects_top3', url: 'http://localhost:3000/projects' },
      { name: 'projects_all', url: 'http://localhost:3000/projects', clickSelector: '.mobile-projects-toggle-line' },
      { name: 'wildfire_modal', url: 'http://localhost:3000/projects?view=firecnn' },
      { name: 'epl_modal', url: 'http://localhost:3000/projects?view=epl-predictor' },
      { name: 'writing', url: 'http://localhost:3000/writing' },
      { name: 'contact', url: 'http://localhost:3000/contact' },
    ];

    const viewports = [
      { name: 'iPhone_SE_375', width: 375, height: 667 },
      { name: 'iPhone_15_390', width: 390, height: 844 },
      { name: 'iPhone_Max_430', width: 430, height: 932 },
    ];

    for (const route of testRoutes) {
      console.log(`\nEvaluating route: ${route.name} (${route.url})`);
      const routeReport = {
        name: route.name,
        url: route.url,
        viewports: []
      };

      for (const vp of viewports) {
        // Set viewport metrics
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 2,
          mobile: true,
          screenWidth: vp.width,
          screenHeight: vp.height
        });

        await send('Emulation.setUserAgentOverride', {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        });

        await send('Page.navigate', { url: route.url });
        await new Promise(r => setTimeout(r, 1200));

        if (route.clickSelector) {
          await send('Runtime.evaluate', {
            expression: `
              const el = document.querySelector(${JSON.stringify(route.clickSelector)});
              if (el) el.click();
            `
          });
          await new Promise(r => setTimeout(r, 600));
        }

        // Evaluate DOM metrics
        const evalMetrics = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const innerW = window.innerWidth;
              const scrollW = document.documentElement.scrollWidth;
              const bodyScrollW = document.body.scrollWidth;
              const hasOverflow = scrollW > innerW + 1 || bodyScrollW > innerW + 1;

              // Find overflowing elements if any
              const overflowingElements = [];
              if (hasOverflow) {
                const allElements = document.querySelectorAll('*');
                for (const el of allElements) {
                  const rect = el.getBoundingClientRect();
                  if (rect.right > innerW + 2) {
                    overflowingElements.push({
                      tag: el.tagName,
                      class: el.className,
                      id: el.id,
                      rectRight: Math.round(rect.right),
                      width: Math.round(rect.width),
                      diff: Math.round(rect.right - innerW)
                    });
                  }
                }
              }

              // Check interactive elements (buttons, links) for tap ergonomics (<36px)
              const smallTapTargets = [];
              const interactives = document.querySelectorAll('button, a, input, select, textarea');
              for (const el of interactives) {
                const rect = el.getBoundingClientRect();
                // only visible elements
                if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
                  if (rect.width < 32 || rect.height < 32) {
                    smallTapTargets.push({
                      tag: el.tagName,
                      class: el.className,
                      text: (el.textContent || '').trim().slice(0, 30),
                      width: Math.round(rect.width),
                      height: Math.round(rect.height)
                    });
                  }
                }
              }

              return {
                innerW,
                scrollW,
                bodyScrollW,
                hasOverflow,
                overflowCount: overflowingElements.length,
                topOverflows: overflowingElements.slice(0, 5),
                smallTapTargetsCount: smallTapTargets.length,
                smallTapTargets: smallTapTargets.slice(0, 6)
              };
            })()
          `,
          returnByValue: true
        });

        const rawResult = evalMetrics.result && evalMetrics.result.result ? evalMetrics.result.result.value : (evalMetrics.result ? evalMetrics.result.value : null);
        const metrics = rawResult || {};
        const vpReport = {
          viewport: vp.name,
          width: vp.width,
          height: vp.height,
          metrics
        };

        if (metrics.hasOverflow) {
          console.warn(`  ⚠️ HORIZONTAL OVERFLOW detected in ${route.name} at ${vp.name}! scrollWidth: ${metrics.scrollW}px, innerWidth: ${metrics.innerW}px`);
          results.overflowBugs.push({
            route: route.name,
            viewport: vp.name,
            overflow: metrics.scrollW - metrics.innerW,
            topElements: metrics.topOverflows
          });
        } else {
          console.log(`  ✅ ${route.name} @ ${vp.name}: No horizontal overflow (${metrics.scrollW}px <= ${metrics.innerW}px)`);
        }

        // Capture full screenshot for the default 390px viewport (and 375px if overflow was detected)
        if (vp.name === 'iPhone_15_390' || metrics.hasOverflow) {
          const shotName = `audit_${route.name}_${vp.name}.png`;
          const shotPath = path.join(ARTIFACT_DIR, shotName);
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            captureBeyondViewport: true
          });
          if (shot.result && shot.result.data) {
            fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
            vpReport.screenshot = shotName;
          }
        }

        routeReport.viewports.push(vpReport);
      }

      results.pages.push(routeReport);
    }

    // Now test Navigation Drawer & Overlay on 390px
    console.log('\nEvaluating Navigation Drawer Interaction on Home...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      screenWidth: 390,
      screenHeight: 844
    });
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(r => setTimeout(r, 1200));

    // Click brand mark 'A'
    await send('Runtime.evaluate', {
      expression: `
        const mark = document.querySelector('.mobile-home-brand-mark');
        if (mark) mark.click();
      `
    });
    await new Promise(r => setTimeout(r, 500));

    const drawerCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const drawer = document.querySelector('.mobile-home-nav-drawer');
          const backdrop = document.querySelector('.mobile-home-menu-backdrop');
          const links = Array.from(document.querySelectorAll('.mobile-home-nav-link')).map(l => l.textContent.trim());
          return {
            isDrawerVisible: !!drawer,
            isBackdropVisible: !!backdrop,
            linksCount: links.length,
            links
          };
        })()
      `,
      returnByValue: true
    });
    const rawDrawer = drawerCheck.result && drawerCheck.result.result ? drawerCheck.result.result.value : (drawerCheck.result ? drawerCheck.result.value : null);
    results.drawerAudit = rawDrawer;
    console.log('Nav drawer evaluation:', results.drawerAudit);

    const drawerShotPath = path.join(ARTIFACT_DIR, 'audit_nav_drawer_open.png');
    const drawerShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (drawerShot.result && drawerShot.result.data) {
      fs.writeFileSync(drawerShotPath, Buffer.from(drawerShot.result.data, 'base64'));
    }

    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'mobile_audit_results.json'),
      JSON.stringify(results, null, 2)
    );
    console.log('\n--- Audit Complete! Report saved to mobile_audit_results.json ---');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
