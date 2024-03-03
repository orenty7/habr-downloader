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

async function downloadMany(
  loader: Loader,
  articleIds: Iterable<string>,
  parallel = 10
) {
  const queue = async.queue(async (id: string, callback: () => void) => {
    try {
      await loader.downloadArticle(id);
      console.log(`Article #${id}: downloaded`);
    } catch (e) {
      queue.push(id);
      console.log(e);
      console.log(`Article #${id}: download failed, adding to retry queue`);
    } finally {
      callback();
    }
  }, parallel);

  for (const articleId of articleIds) {
    queue.push(articleId);
  }

  await queue.drain();
}

async function main() {
  const api = new Api();
  const user = new User("MiraclePtr", api);

  const fileManager = new FileManager();
  await fileManager.init();

  const loader = new Loader(api, fileManager);

  const ids = await user.articleIds();

  await downloadMany(loader, ids);
}

main();
