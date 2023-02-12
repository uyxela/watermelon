import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import axios from "axios";

dotenv.config();

const app: Express = express();
app.use(cors());
const port = process.env.PORT;

const redditResults = async (searchQuery: string) => {};

const youtubeResults = async (searchQuery: string) => {};

const googleResults = async (searchQuery: string) => {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    request.resourceType() === "document"
      ? request.continue()
      : request.abort();
  });

  await page.goto("https://www.google.com/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[aria-label="Search"]', { visible: true });
  await page.type('input[aria-label="Search"]', searchQuery);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.keyboard.press("Enter"),
  ]);

  await page.waitForSelector(".LC20lb", { visible: true });

  const pageTitles = await page.$$eval(".DKV0Md", (els) => {
    return els.map((e: any) => e.innerText);
  });
  const pageLinks = await page.$$eval(".yuRUbf a", (els) => {
    return els.map((e: any) => e.href);
  });
  const pageDescriptions = await page.$$eval(".lEBKkf span", (els) => {
    return els
      .filter((e: any) => e.innerText.length > 21)
      .map((e: any) => e.innerText);
  });

  let searchResults = [];

  for (let i = 0; i < pageTitles.length; i++) {
    searchResults.push({
      title: pageTitles[i],
      link: pageLinks[i],
      description: pageDescriptions[i],
    });
  }

  // const searchResults = await page.$$eval(".LC20lb", (els) => {
  //   return els.map((e: any) => ({
  //     title: e.innerText,
  //     link: e.parentNode.href,
  //   }));
  // });

  await browser.close();
  return searchResults;
};

app.get("/watermelon", (req: Request, res: Response) => {
  res.send("");
});

app.listen(port, () => {
  console.log(`go go watermelon! runnin on ${port}`);
});
