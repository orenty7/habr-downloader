import { Article, Ids } from "./types/index";
import path from "path";
import fs from "fs/promises";

export type Container = InstanceType<(typeof FileManager)["Container"]>;
export type FilePath = string;

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

export class FileManager {
  static Container = class {
    private counter = 0;
    private files = new Map<string, any>();

    constructor(private dir: string) {}

    async save() {
      await fs.mkdir(path.join(this.dir, "images"), { recursive: true });

      const promises: Array<Promise<void>> = [];
      for (const [path, data] of this.files.entries()) {
        promises.push(fs.writeFile(path, data));
      }

      await Promise.all(promises);
    }

    storeArticle(article: Article): FilePath {
      const filepath = path.join(this.dir, "index.json");

      this.files.set(filepath, JSON.stringify(article));

      return path.relative(this.dir, filepath);
    }

    storeImage(name: string, data: any): FilePath {
      const uniqueName = `${this.counter++}-${name}`;
      const filepath = path.join(this.dir, "images", uniqueName);

      this.files.set(filepath, data);

      return path.relative(this.dir, filepath);
    }

    storeFile(name: string, data: any): FilePath {
      const file = path.join(this.dir, name);

      this.files.set(file, data);

      return path.relative(this.dir, file);
    }
  };

  constructor(private dir = path.join(__dirname, "articles")) {}

  async init() {
    await ensureDirExists(this.dir);
  }

  createContainer(article: Article): Container {
    let { id, titleHtml } = article;

    titleHtml = titleHtml.replace(/\//g, "_");
    if (titleHtml.length > 30) {
      titleHtml = titleHtml.slice(0, 27) + "...";
    }

    const name = `${id.padStart(6, "0")} - ${titleHtml}`;
    const dir = path.join(this.dir, article.author.alias, name);
    return new FileManager.Container(dir);
  }
}
