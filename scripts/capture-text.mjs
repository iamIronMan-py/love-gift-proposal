import puppeteer from 'puppeteer-core';
import { writeFile } from 'node:fs/promises';

const url = process.env.QA_URL ?? 'http://127.0.0.1:5174/';
const output = process.env.QA_OUT ?? 'C:\\Users\\FUSION~1\\AppData\\Local\\Temp\\opencode\\baseline.json';
const chrome = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((resolve) => setTimeout(resolve, 1500));

const snapshots = [];
for (const progress of [0, 0.12, 0.3, 0.6, 0.8, 0.95]) {
  await page.evaluate((p) => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, distance * p);
  }, progress);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  snapshots.push(
    await page.evaluate(() => ({
      text: document.body.innerText.replace(/\s+/g, ' ').trim(),
      aria: Array.from(document.querySelectorAll('[aria-label]')).map((el) => el.getAttribute('aria-label')),
      titles: Array.from(document.querySelectorAll('[title]')).map((el) => el.getAttribute('title')),
      gate: document.querySelector('.story-gate__btn')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
      chapter: document.querySelector('.hud__chapter')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
      flight: document.querySelector('.hud__flight')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
    })),
  );
}

await writeFile(output, JSON.stringify(snapshots, null, 2));
await browser.close();
console.log(`captured ${snapshots.length} snapshots -> ${output}`);
