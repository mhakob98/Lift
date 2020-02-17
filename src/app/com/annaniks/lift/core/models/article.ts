export interface ArticleShort {
    id: number;
    name: string;
    articles: ArticleChildShort[];
}

export class ArticleChildShort {
    id: number;
    title: string;
}

export class ArticleFull {
    id: number;
    name: null;
    categoryId: number;
    title: string;
    html: string;
    createdAt: string;
    updatedAt: string;
    category: ArticleCategory;
}

export class ArticleCategory {
    id: number;
    name: string;
    parentId: number;
    parent: {
        id: number;
        name: string;
    }
}