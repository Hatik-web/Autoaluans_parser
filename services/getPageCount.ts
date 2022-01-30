import cheerio from 'cheerio'

interface IProps {
    html: string;
    pageProduct: number;
}

export const getCountPage = async ({ html, pageProduct}: IProps): Promise<number> => {
    const $ = cheerio.load(html);
    const count = $(html).find('span.text-nowrap').find('span.bold').text()
    if(!count) return Math.ceil(1)
    else {
        const pageNon = Number(count) / pageProduct
        console.info(Math.ceil(pageNon) + ' Страниц')
        return Math.ceil(pageNon)
    }
}