import { Api } from "./api";
import { User } from "./user";
import { Loader } from "./loader";
import { FileManager } from "./file-manager";

const async = require("async");
const axios = require("axios");
const fs = require("fs").promises;
const HtmlParser = require("node-html-parser");

async function ensureDirExists(dir: string) {
  try {
    await fs.access(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
    );
  } catch (e) {
    await fs.mkdir(dir);
  }
}

async function downloadMany(articleIds: Array<string>, parallel = 10) {
  await ensureDirExists("./articles/");
  const loader = new Loader(new Api(), new FileManager());

  const queue = async.queue(async (id: string, callback: () => void) => {
    try {
      await loader.downloadArticle(id);
      console.log(`Article #${id}: downloaded`);
    } catch (e) {
      retry.push(id);
      console.log(
        `Article #${id}: download failed, added id to the retry list`
      );
    } finally {
      callback();
    }
  }, parallel);

  const retry: Array<string> = [];
  for (const articleId of articleIds) {
    queue.push(articleId);
  }

  await queue.drain();

  await fs.writeFile("./retry.json", JSON.stringify({ retry }));
}

async function main() {
  const api = new Api();
  const fileManager = new FileManager();
  // const user = new User("MiraclePtr", api);
  await fileManager.init();

  const loader = new Loader(api, fileManager);

  await loader.downloadArticle("796595");
}

main();
