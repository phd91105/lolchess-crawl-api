import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";

const app = express();
const url = "https://lolchess.gg/meta";
const html = await axios.get(url);
const $ = cheerio.load(html.data);

const array = [];
$(".guide-meta__deck-box").each((_, element) => {
  const champs = [];
  const teamName = $(element)
    .find(".guide-meta__deck > .name")
    .text()
    .split("\n\n")[0]
    .trim();
  const teamStatus = $(element)
    .find(".guide-meta__deck > .name")
    .text()
    .split("\n\n")[1]
    .trim();
  const traits = $(element).find(
    ".guide-meta__deck > .traits > .tft-hexagon-image"
  );
  const traitLst = [];
  traits.each((_, element) => {
    const trait = "https://lolchess.gg/" + $(element).find("img").attr("src");
    const hexagonType = $(element).attr("class").split("--")[1];
    traitLst.push({ trait, hexagonType });
  });
  const minCost = $(element).find(".guide-meta__deck > .cost").text().trim();
  const champLst = $(element).find(".tft-champion-box");
  champLst.each((_, element) => {
    const champImg =
      "https:" + $(element).find(".tft-champion > img").attr("src");
    const champName = $(element).find(".tft-champion > .name").text();
    const champCost = $(element).find(".tft-champion > .cost").text();
    const items = $(element).find(".tft-items > img");
    const itemList = [];
    items.each((_, element) => {
      const itemName = $(element).attr("alt");
      const itemImg = "https:" + $(element).attr("src");
      itemList.push({ itemName, itemImg });
    });
    champs.push({ champName, champCost, champImg, itemList });
  });
  array.push({ teamName, teamStatus, minCost, champs, traitLst });
});

app.get("/", (req, res) => {
  res.json(array);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});
