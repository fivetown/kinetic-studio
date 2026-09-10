import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Kinetic Typography Headless Video Generator Starting...');
  const inputDir = path.join(__dirname, 'video-inputs');
  const outputDir = path.join(__dirname, '../output_videos');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} input script(s) in ${inputDir}`);

  let playwright;
  try {
    playwright = await import('playwright');
  } catch (e) {
    console.log('Playwright importing...');
    try {
      playwright = await import('playwright-core');
    } catch (e2) {
      console.error('Please run npx playwright install chromium before executing.');
      process.exit(0);
    }
  }

  const { chromium } = playwright;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: outputDir }
  });

  const baseUrl = process.env.RENDER_BASE_URL || 'http://localhost:4173/kinetic';
  console.log(`Connecting to Kinetic Typography Studio at: ${baseUrl}`);

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const scriptData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Processing script: ${scriptData.name || scriptData.id}...`);

    // Dynamic resolution based on aspect ratio
    let width = 1920;
    let height = 1080;
    if (scriptData.aspect === '9-16') {
      width = 1080;
      height = 1920;
    } else if (scriptData.aspect === '1-1') {
      width = 1080;
      height = 1080;
    }

    const context = await browser.newContext({
      viewport: { width, height },
      recordVideo: { dir: outputDir, size: { width, height } }
    });

    const page = await context.newPage();
    const renderUrl = `${baseUrl}?mode=render`;

    try {
      await page.goto(renderUrl, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (err) {
      console.log(`Navigating to ${renderUrl} with domcontentloaded...`);
      await page.goto(renderUrl, { waitUntil: 'domcontentloaded' });
    }

    // Safely inject script data and background options into Kinetic Studio
    await page.evaluate((data) => {
      if (typeof window.__KINETIC_SET_SCRIPT__ === 'function') {
        window.__KINETIC_SET_SCRIPT__(data);
      }
    }, scriptData);

    // Wait a brief moment for layout/fonts to settle
    await page.waitForTimeout(600);

    // Dynamically retrieve exact animation playback duration (Intro + Words + 1.5s Hold + Outro)
    const exactDuration = await page.evaluate(() => {
      return typeof window.__KINETIC_GET_DURATION__ === 'function'
        ? window.__KINETIC_GET_DURATION__()
        : 8.0;
    });

    console.log(`Recording animation playback for exact duration: ${exactDuration.toFixed(2)}s...`);
    await page.waitForTimeout(Math.ceil((exactDuration + 0.6) * 1000));

    const video = page.video();
    await page.close();
    await context.close();

    if (video) {
      const videoPath = await video.path();
      const targetFileName = path.join(outputDir, `${scriptData.id || 'output'}.webm`);
      fs.renameSync(videoPath, targetFileName);
      console.log(`✅ Pure Kinetic Video Rendered: ${targetFileName}`);
    }
  }

  await browser.close();
  console.log('✨ All Kinetic Videos Rendered Successfully!');
}

main().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
