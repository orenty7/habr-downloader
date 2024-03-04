import { Api } from "./api";
import { User } from "./user";
import { Loader } from "./loader";
import { FileManager } from "./file-manager";
import { Ids } from "./types";

const async = require("async");
const axios = require("axios");

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

async function indexArticles() {
  const loadPage = (page: number) => {
    const url = new URL("https://habr.com/kek/v2/articles/");
    url.searchParams.set("period", "alltime");
    url.searchParams.set("fl", "ru");
    url.searchParams.set("hl", "ru");
    url.searchParams.set("sort", "date");
    url.searchParams.set("page", page.toString());
    url.searchParams.set("perPage", "100");

    return axios.get(url.toString()).then((response: any) => response.data);
  };

  const { pagesCount } = await loadPage(1);
  const best: Array<Ids.Article> = [];
  for (let page = 1; page <= pagesCount; page++) {
    const { publicationIds } = await loadPage(page);
    best.push(...publicationIds);
  }

  return new Set(best);
}

async function main() {
  const api = new Api();

  const usernames: Array<string> = ["MiraclePtr", "orenty7"];
  const users = usernames.map((username) => new User(username, api));

  const groupedIds = await Promise.all(users.map((user) => user.articleIds()));

  const ids: Array<string> = [];
  for (const userArticleIds of groupedIds) {
    for (const id of userArticleIds) {
      ids.push(id);
    }
  }

  const fileManager = new FileManager();
  await fileManager.init();

  const loader = new Loader(api, fileManager);

  await downloadMany(loader, ids, {
    min: 10,
    max: 20,
    initial: 20,
  });
}

main();
