import {parsListProducts} from "./parsListProducts";
import {getHtml} from "./getHtml";


export const getListProducts = async (start, quantityPage: number, html: string, url: string) => {
    try {
        let listProducts = []
        for (let i = start; i <= quantityPage; i++){
            try {
                console.log('ОТ '+ start + "ДО " + quantityPage)
                if(i === 1){
                    const products = await parsListProducts(html)
                    listProducts = listProducts.concat(products);
                } else {
                    const html = await getHtml(url + i)
                    const products = await parsListProducts(html)
                    listProducts = listProducts.concat(products);
                }
            } catch (e) {
                console.error('ОШИБКА В ЦИКЛЕ ПАРСИНГА СТРАНИЦ')
            }
        }
        return listProducts
    } catch (e) {
        console.error('ОШИБКА ПОЛУЧЕНИЯ ВСЕХ ПРОДУКТОВ')
    }
}