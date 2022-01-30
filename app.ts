import {getHtml} from "./services/getHtml";
import {formationUrlGetHtml, formationUrlListProducts, saveJsonFormat} from "./services/utils";
import {getCountPage} from "./services/getPageCount";
import {getListProducts} from "./services/getListProduct";
import { v4 as uuid } from 'uuid';
import cheerio from "cheerio";
import { isInteger } from 'lodash'


const url = 'https://www.autoopt.ru/catalog/raskhodniki_i_komplektuyushchie'
const pageProduct = 100 //Сколько товаров на 1 странице

export const start = async (cluster) => {
    console.log(cluster)
    const html: string = await getHtml(formationUrlGetHtml({ url, pageProduct}));
    let quantityPage = await getCountPage({ html, pageProduct})

    const allPage = (quantityPage - quantityPage % 12) / 12
    const isInt = isInteger(allPage)

    let start = 1
    if (cluster === 1) {
        quantityPage = allPage
        start = 1
    }
    if (cluster === 2) {
        quantityPage = allPage * 2
        start = allPage + 1
    }
    if (cluster === 3) {
        quantityPage = allPage * 3
        start = allPage * 2 + 1
    }
    if (cluster === 4) {
        quantityPage = allPage * 4
        start = allPage * 3 + 1
    }
    if (cluster === 5) {
        quantityPage = allPage * 5
        start = allPage * 4 + 1
    }
    if (cluster === 6) {
        quantityPage = allPage * 6
        start = allPage * 5 + 1
    }
    if (cluster === 7) {
        quantityPage = allPage * 7
        start = allPage * 6 + 1
    }
    if (cluster === 8) {
        quantityPage = allPage * 8
        start = allPage * 7 + 1
    }
    if (cluster === 9) {
        quantityPage = allPage * 9
        start = allPage * 8 + 1
    }
    if (cluster === 10) {
        quantityPage = allPage * 10
        start = allPage * 9 + 1
    }
    if (cluster === 11) {
        quantityPage = allPage * 11
        start = allPage * 10 + 1
    }
    if (cluster === 12) {
        quantityPage = isInt ? allPage * 12 : allPage * 12 + 1
        start = allPage * 11 + 1
    }

    const listProducts = await getListProducts(start, quantityPage, html, formationUrlListProducts({ url, pageProduct}))
    const result = await pars(listProducts);
    saveJsonFormat('Автотовары_расходники', result)
}

async function pars(listProducts) {
    const resultParser = []
    let i = 1
    for (const product of listProducts) {
        if (Object.keys(product).length !== 0) {
            console.info('Парсим товар ' + i )
            console.info(`Осталось - ${listProducts.length - i}`)
            const res = await getDataPars(product)
            resultParser.push(res)
            i++
        }
    }
    return resultParser
}
async function getDataPars(product) {
    try {
        const html = await getHtml(product.link + '?pageSize=30')
        const $ = cheerio.load(html)

        const specifications = []
        const params = []
        const description = []
        const analogs = []
        const applicability = []

        let catalogs = []

        $(html).find('table.striped-narrow.w-100.mb-4.table-item-options').find('tr').each(function (ind, elem) {
            const title = $(elem).find(':first-child').text()
            const value = $(elem).find(':last-child').text()

            const param = {}
            param[title]  = value
            params.push(param)
        })
        $(html).find('table.striped-narrow.w-100.table-specification').find('tr').each(function (ind, elem) {
            const title = $(elem).find(':first-child').text()
            const value = $(elem).find(':last-child').text()

            if(title === 'Код для заказа') return
            if(title === 'Каталожная группа') {
                const group = value.split(',').shift().trim();
                const subGroup = value.split('.').pop().trim();

                const gr = {}
                const pgr = {}
                gr[`Группа`]  = group
                pgr[`Подгруппа`]  = subGroup
                specifications.push(gr,pgr)
            }
            const specification = {}
            specification[title]  = value
            specifications.push(specification)

        })
        $(html).find('div.col-12.tab-description').each((ind, elem) => {
            description.push($(elem).html().trim())
        })
        $(html).find('li[role="tab"]').each((ind, elem) => {
            const mm = $(elem).find('a').text()
            const text = mm.split('и').shift().trim();
            if (text === 'Аналог') {
                $(html).find('div.n-catalog-item.relative.grid-item').each((l, element) => {
                    const article = $(element).find('span.string.bold.nowrap.n-catalog-item__click-copy').text().trim()
                    if(article){
                        analogs.push(article)
                    }
                })
            }
            const aa = $(elem).find('a').text()
            const textLink = aa.split('ь').shift().trim();
            if (textLink === 'Применяемост') {
                const attr = $(elem).find('a').attr('href')
                const url = product.link + attr
                if(url) applicability.push(url)
            }

            if (text === 'Категор') {
                const list = $(html).find('div.category-list')
                $(list).find('a[data-toggle="collapse"].bold').each((i, element) => {
                    const catalog = $(element).find('span[itemprop="category"]').text()

                    let list = []
                    $(element).next().find('span[itemprop="category"]')
                        .each((index, elem) => {
                            const category = $(elem).text()
                            list.push(category)
                        })

                    catalogs.push({
                        catalog,
                        ...list
                    })
                    list = []
                })
            }
        })

        console.log({
            ['Артикул']: product.mainArticle,
        })
        return {
            ['Название']: product.name,
            ['Артикул']: product.mainArticle,
            ['Характеристики']: specifications,
            ['Параметры']: params,
            ['Аналоги']: analogs,
            ['Описание']: description,
            ['Ссылка на применяемость']: applicability,
            ['Место в каталогах']: catalogs,
            ['Ссылка на Автотовар']: product.link,
            id: uuid()
        }
    } catch (e) {
        console.error('ОШИБКА ПАРСИНГА ДАННЫХ')
        console.error(e)
    }
}