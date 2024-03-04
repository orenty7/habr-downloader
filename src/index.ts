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
  parallel: { min?: number; max?: number; initial?: number } = {}
) {
  const { max, initial } = parallel;
  const min = Math.max(1, parallel.min ?? 0);

  const clamp = (i: number) => {
    if (min !== undefined && i < min) return min;
    if (max !== undefined && i > max) return max;
    return i;
  };

  const queue = async.queue(
    async (id: string, callback: () => void) => {
      try {
        await loader.downloadArticle(id);
        queue.concurrency = clamp(queue.concurrency + 1);

        console.log(`Article #${id}: downloaded`);
      } catch (e) {
        queue.concurrency = clamp(queue.concurrency - 1);
        queue.push(id);

        console.log(e);
        console.log(`Article #${id}: download failed, adding to retry queue`);
      } finally {
        console.log("concurrency:", queue.concurrency);
        callback();
      }
    },
    initial ?? min ?? max ?? 10
  );

  for (const articleId of articleIds) {
    queue.push(articleId);
  }

  await queue.drain();
}

async function main() {
  const api = new Api();
  const user = new User("MaxRokatansky", api);

  const fileManager = new FileManager();
  await fileManager.init();

  const loader = new Loader(api, fileManager);

  const ids = await user.articleIds();
  await downloadMany(loader, ids, {
    min: 10,
    max: 20,
    initial: 20,
  });
}

main();
