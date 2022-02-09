// ----------------
// Builder Pattern
// どんな順序でどこに何を配置するかという「手順」と「柱や壁は何を使うか」という「材料」のように「手順」「材料」を分ける
// オブジェクトの生成過程と生成手段を分離するパターン
// Product（製品）の生成過程や生成手段を隠蔽でき、コードを局所化できる
// ClientがDirector（建築者）に依頼して、DirectorはBuilder（生成手段）で定義されたAPIを使ってObjectを生成。
// ----------------
import Parser from "rss-parser" // yarn add rss-parser

namespace BuilderPattern {

    class News { // Product
        private readonly _title: string
        private readonly _url: string

        constructor(title: string, url: string) {
            this._title = title
            this._url = url
        }

        public title = (): string => this._title
        public url = (): string => this._url
    }

    interface NewsBuilder { // Builder
        parse(data: string): Promise<News[]>
    }

    type RssData = {
        date: string
        title: string
        link: string
        'dc:date': string
        content: string
        contentSnippet: string
        isoDate: string
    }

    export class RssNewsBuilder implements NewsBuilder {
        async parse(url: string): Promise<News[]> {
            const parser = new Parser()
            const data = await parser.parseURL(url) as { items: RssData[] }

            return data.items.map(item => {
                return new News(item.title, item.link)
            })
        }
    }

    export class NewsDirector { // Director
        private readonly _builder: NewsBuilder // 手順
        private readonly _url: string // 材料

        constructor(builder: NewsBuilder, url: string) {
            this._builder = builder
            this._url = url
        }

        public getNews(): Promise<News[]> {
            return this._builder.parse(this._url)
        }
    }
}

(async () => {
        const director = new BuilderPattern.NewsDirector(
            new BuilderPattern.RssNewsBuilder(),
            "https://www.php.net/news.rss"
        )

        const newList = await director.getNews()
        newList.forEach(news => console.log(news.title() + news.url()))
    }
)()




