import { Container, FileManager, FilePath } from "./file-manager";

import { Api } from "./api";
import { Ids } from "./types/index";

import axios from "axios";

const HtmlParser = require("node-html-parser");

export class Loader {
  constructor(
    private api: Api,
    private fileManager: FileManager
  ) {}

  private async loadAndReplaceImages(
    rawHtml: string,
    container: Container
  ): Promise<string> {
    const html = HtmlParser.parse(rawHtml);

    for (const img of html.querySelectorAll("img")) {
      const src = img.getAttribute("data-src") ?? img.getAttribute("src");
      if (!src) {
        continue;
      }

      const [name] = new URL(src).pathname.match(/[^/]*$/);

      const image = await axios.get(src, { responseType: "arraybuffer" });
      const url = container.storeImage(name, image.data);

      img.setAttribute("src", url);
    }

    return html.toString();
  }

  private async loadAvatar(
    url: string,
    container: Container,
    cache: Map<string, FilePath>
  ): Promise<FilePath | undefined> {
    if (url.startsWith("//")) {
      url = "https:" + url;
    }

    if (cache.has(url)) {
      return cache.get(url);
    }

    const [name] = new URL(url).pathname.match(/([^/]*)\.(\w*)$/);
    const image = await axios
      .get(url, { responseType: "arraybuffer" })
      .catch((error) => {
        if (typeof error === "object" && error?.status === 404) {
          return undefined;
        } else {
          throw error;
        }
      });

    if (!image) {
      return undefined;
    }

    const [extention] = name.match(/\.\w*$/);
    const filepath = container.storeImage("avatar" + extention, image.data);

    cache.set(url, filepath);

    return filepath;
  }

  async downloadArticle(
    id: Ids.Article,
    options: { loadImages?: boolean; loadComments?: boolean } = {}
  ) {
    const defaults = {
      loadImages: true,
      loadComments: true,
    };

    const { loadImages, loadComments } = { ...defaults, ...options };

    const article = await this.api.article(id);
    const container = this.fileManager.createContainer(article);

    const avatarCache = new Map<string, FilePath>();

    if (loadImages) {
      const { author } = article;

      author.avatarUrl &&= await this.loadAvatar(
        author.avatarUrl,
        container,
        avatarCache
      );

      article.textHtml = await this.loadAndReplaceImages(
        article.textHtml,
        container
      );
    }

    if (loadComments) {
      const response = await this.api.comments(id);

      if (loadImages) {
        for (const comment of Object.values(response.comments)) {
          comment.message = await this.loadAndReplaceImages(
            comment.message,
            container
          );

          const { author } = comment;
          author.avatarUrl &&= await this.loadAvatar(
            author.avatarUrl,
            container,
            avatarCache
          );
        }
      }

      container.storeFile("comments.json", JSON.stringify(response));
    }

    container.storeArticle(article);
    container.storeFile("index.html", article.textHtml);

    await container.save();
  }
}
