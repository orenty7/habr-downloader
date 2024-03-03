import { Api } from "./api";

export class User {
  constructor(
    public username: string,
    private api: Api
  ) {}

  async articleIds() {
    const { pagesCount } = await this.api.userArticles({
      user: this.username,
      perPage: 100,
    });

    const ids: Array<string> = [];
    for (let page = 1; page <= pagesCount; page++) {
      const { publicationIds } = await this.api.userArticles({
        user: this.username,
        perPage: 100,
        page,
      });

      ids.push(...publicationIds);
    }

    return ids;
  }
}
