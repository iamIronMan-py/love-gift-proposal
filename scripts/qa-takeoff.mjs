import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const url = process.env.QA_URL ?? 'http://127.0.0.1:5174/';
const chrome = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('qa', 'takeoff');
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--mute-audio'],
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openPage(viewport, name) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await wait(1600);
  page.on('close', () => {
    if (errors.length) console.log(`[${name}] ${errors.join('\n')}`);
  });
  return { page, errors };
}

const { page, errors } = await openPage({ width: 1440, height: 900 }, 'desktop');

const clickStage = async (x = 720, y = 450) => {
  await page.mouse.click(x, y);
};

for (let i = 0; i < 3; i += 1) {
  await clickStage();
  await wait(2600);
}

const takeoffStart = Date.now();
for (let i = 0; i < 30; i += 1) {
  const target = i * 500;
  const remaining = target - (Date.now() - takeoffStart);
  if (remaining > 0) await wait(remaining);
  await page.screenshot({
    path: path.join(outDir, `desktop-${String(i).padStart(2, '0')}-${target}ms.png`),
    type: 'png',
  });
}
for (let i = 0; i < 6; i += 1) {
  await page.screenshot({
    path: path.join(outDir, `desktop-cruise-${i}.png`),
    type: 'png',
  });
  await wait(500);
}

const afterTakeoff = await page.evaluate(() => {
  const gate = document.querySelector('.story-gate__btn');
  const flight = document.querySelector('[data-flight]');
  return {
    chapter: document.querySelector('.hud__chapter')?.textContent?.replace(/\s+/g, ' ').trim(),
    gateOpacity: gate ? getComputedStyle(gate).opacity : null,
    flightOpacity: flight ? getComputedStyle(flight).opacity : null,
    scroll: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),
    cutscene: document.querySelector('.cutscene')?.getAttribute('data-active'),
  };
});

await clickStage();
await wait(2600);
const afterFirstClick = await page.evaluate(() => ({
  chapter: document.querySelector('.hud__chapter')?.textContent?.replace(/\s+/g, ' ').trim(),
  gateOpacity: getComputedStyle(document.querySelector('.story-gate__btn')).opacity,
  gatePointer: getComputedStyle(document.querySelector('.story-gate__btn')).pointerEvents,
  scroll: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),
}));

console.log(JSON.stringify({ afterTakeoff, afterFirstClick, errors }, null, 2));
await page.close();
await browser.close();
