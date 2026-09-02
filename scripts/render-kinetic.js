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

    const page = await context.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (err) {
      console.log(`Navigating to ${baseUrl} with domcontentloaded...`);
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    }

    // Switch to Text/Script tab if needed
    const scriptTabBtn = page.locator('button:has-text("Script")');
    if (await scriptTabBtn.isVisible()) {
      await scriptTabBtn.click();
    }

    // Fill in custom script inputs
    if (scriptData.title) {
      await page.fill('input[value*="학습 목표"]', scriptData.title).catch(() => {});
    }

    if (scriptData.phrase) {
      const textarea = page.locator('textarea');
      if (await textarea.isVisible()) {
        await textarea.fill(scriptData.phrase);
      }
    }

    if (scriptData.outro) {
      const outroInput = page.locator('input').nth(2);
      if (await outroInput.isVisible()) {
        await outroInput.fill(scriptData.outro);
      }
    }

    // Apply custom script
    const applyBtn = page.locator('button:has-text("Apply Custom Script")');
    if (await applyBtn.isVisible()) {
      await applyBtn.click();
    }

    // Wait for playback duration (Intro + Words + 1.5s Hold + Outro)
    console.log('Recording video animation playback...');
    await page.waitForTimeout(7000);

    const video = page.video();
    await page.close();

    if (video) {
      const videoPath = await video.path();
      const targetFileName = path.join(outputDir, `${scriptData.id || 'output'}.webm`);
      fs.renameSync(videoPath, targetFileName);
      console.log(`✅ Kinetic Video Rendered: ${targetFileName}`);
    }
  }

  await browser.close();
  console.log('✨ All Kinetic Videos Rendered Successfully!');
}

main().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
