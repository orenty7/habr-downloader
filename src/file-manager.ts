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
    private dir: string;
    private counter = 0;

    constructor(articleId: Ids.Article, parentDir: string) {
      this.dir = path.join(parentDir, articleId);
    }

    async init() {
      await fs.mkdir(this.dir);
      await fs.mkdir(path.join(this.dir, "images"));
    }

    async storeArticle(article: Article): Promise<FilePath> {
      const file = path.join(this.dir, "index.json");
      await fs.writeFile(file, JSON.stringify(article));

      return path.relative(this.dir, file);
    }

    async storeImage(name: string, data: any): Promise<FilePath> {
      const uniqueName = `${this.counter++}-${name}`;
      const file = path.join(this.dir, "images", uniqueName);
      await fs.writeFile(file, data);

      return path.relative(this.dir, file);
    }

    async storeFile(name: string, data: any): Promise<FilePath> {
      const file = path.join(this.dir, name);
      await fs.writeFile(file, data);

      return path.relative(this.dir, file);
    }
  };

  constructor(private dir = path.join(__dirname, "articles")) {}

  async init() {
    await ensureDirExists(this.dir);
  }

  async createContainer(articleId: Ids.Article): Promise<Container> {
    const container: Container = new FileManager.Container(articleId, this.dir);
    await container.init();

    return container;
  }
}
