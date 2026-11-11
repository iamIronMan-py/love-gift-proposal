import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const url = process.env.QA_URL ?? 'http://127.0.0.1:5174/';
const chrome = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('qa');
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--mute-audio'],
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function capture(viewport, prefix) {
  const page = await browser.newPage();
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await wait(1800);

  const shot = async (name) => {
    await page.screenshot({ path: path.join(outDir, `${prefix}-${name}.png`), type: 'png' });
    console.log(`${prefix}-${name}`);
  };

  await shot('intro');

  const clickGate = async () => {
    await page.$eval('.story-gate__btn', (el) => el.click());
  };

  await clickGate();
  await wait(2200);
  await clickGate();
  await wait(2200);
  await clickGate();

  const started = Date.now();
  for (const [label, target] of [
    ['runway-2', 2000],
    ['runway-5', 5000],
    ['runway-8', 8000],
    ['runway-11', 11000],
  ]) {
    const remaining = target - (Date.now() - started);
    if (remaining > 0) await wait(remaining);
    await shot(label);
  }

  await wait(5000);
  await page.evaluate(() => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, distance * 0.6);
  });
  await wait(4000);
  await shot('bloom');

  await page.evaluate(() => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, distance * 0.95);
  });
  await wait(4000);
  await shot('finale');

  await page.close();
}

await capture({ width: 1440, height: 900 }, 'desktop');
await capture({ width: 390, height: 844, isMobile: true, hasTouch: true }, 'mobile');

await browser.close();
console.log(`screenshots -> ${outDir}`);
