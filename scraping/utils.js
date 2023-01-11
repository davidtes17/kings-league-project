import * as cheerio from 'cheerio'
import { writeDBFile } from '../db/index.js'
import { logInfo, logSuccess, logError } from './log.js'
import { getLeaderboard } from './leaderboard.js'
import { getMVP } from './mvp.js'

export const SCRAPINGS = {
    leaderboard: {
        url: 'https://kingsleague.pro/estadisticas/clasificacion/',
        scraper: getLeaderboard
    },
    mvp: {
        url: 'https://kingsleague.pro/estadisticas/mvp/',
        scraper: getMVP
    }
}

async function scrape(url) {
    //Petición de la página mediante fetch
    const res = await fetch(url)
    const html = await res.text()

    //Retorna la libreria con el HTML de la página usando la simbologia de JQuery
    return cheerio.load(html)
}

export async function scrapeAndSave(name) {
    try {
        const { url, scraper } = SCRAPINGS[name]

        logInfo(`Scraping ${name}...`)
        const $ = await scrape(url)
        const data = await scraper($)
        logSuccess(`${name} scraped successfully!`)

        logInfo(`Writing ${name} to DB...`)
        await writeDBFile(name, data)
        logSuccess(`${name} written to DB successfully!`)
    } catch (error) {
        logError(`Error scraping ${name}`)
        logError(error)
    }
}

export function cleanText(text) {
    return text
        .replace(/\t|\n|\s:/g, '')
        .replace(/.*:/g, '')
}