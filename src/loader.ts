import { Container, FileManager } from "./file-manager";

import { Api } from "./api";
import { Ids } from "./types/index";

const axios = require("axios");
const HtmlParser = require("node-html-parser");

export class Loader {
  constructor(
    private api: Api,
    private fileManager: FileManager
  ) {}

  private async loadAndReplaceImages(rawHtml: string, container: Container) {
    const html = HtmlParser.parse(rawHtml);

    const images = html.querySelectorAll("img").map(async (img: any) => {
      const src = img.getAttribute("data-src") ?? img.getAttribute("src");
      const [name] = new URL(src).pathname.match(/([^/]*)\.(\w*)$/);

      const image = await axios.get(src, { responseType: "arraybuffer" });
      const url = await container.storeImage(name, image.data);

      img.setAttribute("src", url);
    });

    await Promise.all(images);

    return html.toString();
  }

  async downloadArticle(id: Ids.Article, loadImages = true) {
    const container = await this.fileManager.createContainer(id);
    const article = await this.api.article(id);

    if (loadImages) {
      article.textHtml = await this.loadAndReplaceImages(
        article.textHtml,
        container
      );
    }

    await container.storeArticle(article);
    await container.storeFile("index.html", article.textHtml);
  }
}
