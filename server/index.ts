import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import axios, { all } from "axios";
import cohere from "cohere-ai";

dotenv.config();

const app: Express = express();
app.use(cors());

const port = process.env.PORT;
const youtubeAPIKey = process.env.YOUTUBE_API_KEY;
const cohereAPIKey = process.env.COHERE_API_KEY;

if (!youtubeAPIKey || !cohereAPIKey) process.exit(1);

cohere.init(cohereAPIKey);

const redditURL =
  "https://www.reddit.com/search.json?sort=relevance&type=link&limit=100&q=";
const youtubeURL = `https://www.googleapis.com/youtube/v3/search?key=${youtubeAPIKey}&part=snippet&type=video&maxResults=2&q=`;

const getRedditResults = async (searchQuery: string) => {
  const response = await axios.get(redditURL + searchQuery);
  const data = response.data.data.children;
  const searchResults = data
    .filter((item: any) => item.data.selftext !== "")
    .map((item: any) => ({
      title: item.data.title,
      link: item.data.url,
      description: item.data.selftext,
      subreddit: item.data.subreddit_name_prefixed,
      author: item.data.author,
    }));
  return searchResults.slice(0, 3);
};

const getYoutubeResults = async (searchQuery: string) => {
  const response = await axios.get(youtubeURL + searchQuery);
  const data = response.data.items;
  const searchResults = data.map((item: any) => {
    return {
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      author: item.snippet.channelTitle,
    };
  });
  return searchResults;
};

const getGoogleResults = async (searchQuery: string) => {
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

  await browser.close();
  return searchResults;
};

const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

app.get("/watermelon", async (req: Request, res: Response) => {
  if (!req.query.q) {
    res.sendStatus(400);
    return;
  }

  const searchTerm = req.query.q as string;

  const redditResults = await getRedditResults(encodeURIComponent(searchTerm));
  const youtubeResults = await getYoutubeResults(
    encodeURIComponent(`${searchTerm}|${searchTerm} review`)
  );
  const googleResults = await getGoogleResults(searchTerm);

  const allDescriptions =
    "" +
    redditResults.map((item: any) => item.description).join("\n") +
    "\n" +
    youtubeResults.map((item: any) => item.description).join("\n") +
    "\n" +
    googleResults.map((item: any) => item.description).join("\n");

  const cohereResponse = await cohere.generate({
    model: "command-xlarge-nightly",
    prompt: "Summarize the following:\n" + allDescriptions,
    max_tokens: 150,
    temperature: 0.9,
    k: 0,
    p: 0.75,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: [],
    return_likelihoods: "NONE",
  });

  res.send({
    summary: cohereResponse.body.generations[0].text,
    items: shuffle([...redditResults, ...youtubeResults, ...googleResults]),
  });
});

app.listen(port, () => {
  console.log(`go go watermelon! runnin on ${port}`);
});
