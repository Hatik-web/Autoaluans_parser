import axios from "axios";

export const getHtml = async (URL: string) => {
    try {
        const result = await axios.get(URL, {
            headers: {
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            }
        })
        return result.data
    } catch (e) {
        console.error('ОШИБКА ЗАГРУЗКИ СТРАНИЦЫ ПРИ ПОЛУЧЕНИИ HTML')
    }
}