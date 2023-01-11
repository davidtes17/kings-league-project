import * as cheerio from 'cheerio' 

const URLS = {
    leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
    mvp: 'https://kingsleague.pro/estadisticas/mvp/'
}

async function scrape(url) {
    //Petición de la página mediante fetch
    const res = await fetch(url)
    const html = await res.text()

    //Retorna la libreria con el HTML de la página usando la simbologia de JQuery
    return cheerio.load(html)
}

export function cleanText(text) {
    return text
        .replace(/\t|\n|\s:/g, '')
        .replace(/.*:/g, '')
}

export const LEADERBOARD_PAGE = scrape(URLS.leaderboard);
export const MVP_PAGE = scrape(URLS.mvp);