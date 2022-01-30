import cheerio from "cheerio";

export const parsListProducts = async (html: string) => {
    try {
        const $ = cheerio.load(html);
        const products = []

        $(html).find('div.n-catalog-item.relative.grid-item').each(function (i, elem){
            const name = $(elem).find('div.string').find('a.n-catalog-item__name-link').text().trim()
            if(name){
                products.push({
                    name,
                    mainArticle: $(elem).find('div.n-catalog-item__article').find('span.string.bold.nowrap.n-catalog-item__click-copy').text(),
                    link: 'https://www.autoopt.ru/'+ $(elem).find('div.string').find('a.n-catalog-item__name-link').attr('href')
                })
            }
        })
        return products
    } catch (e) {
        console.error('ОШИБКА ПОЛУЧЕНИЯ ПРОДУКТОВ')
    }
}