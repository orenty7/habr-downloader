import { Article, Comments } from "./types/index";

const axios = require("axios");

export class Api {
  async article(id: string): Promise<Article> {
    const url = new URL(`https://habr.com/kek/v2/articles/${id}/`);

    const response = await axios.get(url.toString());
    return response.data;
  }

  async userArticles(params: {
    user: string;
    perPage?: number;
    page?: number;
  }): Promise<{
    pagesCount: number;
    publicationRefs: Record<string, unknown>; // Лень прописывать тип
    publicationIds: Array<string>;
  }> {
    const url = new URL("https://habr.com/kek/v2/articles/");
    for (const [name, value] of Object.entries(params)) {
      url.searchParams.append(name, String(value));
    }

    const response = await axios.get(url.toString());
    return response.data;
  }

  async comments(articleId: string): Promise<Comments> {
    const url = new URL(
      `https://habr.com/kek/v2/articles/${articleId}/comments`
    );

    const response = await axios.get(url.toString());
    return response.data;
  }
}
