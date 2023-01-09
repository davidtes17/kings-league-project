import * as cheerio from 'cheerio' // Lib para procesar el HTML
import { writeFile } from 'node:fs/promises' //fs Lib para leer y escribir archivos
import path from 'node:path' // Lib para manejar rutas de archivos

const URLS = {
    leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape(url) {
    //Petición de la página mediante fetch
    const res = await fetch(url)
    const html = await res.text()

    //Retorna la libreria con el HTML de la página usando la simbologia de JQuery
    return cheerio.load(html)
}

function cleanText(text) {
    return text
        .replace(/\t|\n|\s:/g, '')
        .replace(/.*:/g, '')
}

async function getLeaderboard() {
    const $ = await scrape(URLS.leaderboard)
    const $rows = $('table tbody tr')
    
    const LEADERBOARD_SELECTORS = {
        team: { selector: '.fs-table-text_3', typeOf: 'string' },
        wins: { selector: '.fs-table-text_4', typeOf: 'number' },
        losses: { selector: '.fs-table-text_5', typeOf: 'number' },
        scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
        concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
        yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
        redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
    }
    
    const leaderboard = []
    $rows.each((_, item) => {
        const $item = $(item)

        const leaderboardEntries = Object.entries(LEADERBOARD_SELECTORS)
            .map(([key, { selector, typeOf }]) => {
                const rawValue = $item.find(selector).text()
                let cleanValue = cleanText(rawValue);

                const value = typeOf === 'number'
                    ? Number(cleanValue)
                    : cleanValue

                return [key, value]
            })

        leaderboard.push(Object.fromEntries(leaderboardEntries))
    })

    return leaderboard
}

const leaderboard = await getLeaderboard()

const filePaths = {
    leaderboard: path.join(process.cwd(), 'db', 'leaderboard.json'),
} 

await writeFile(filePaths.leaderboard, JSON.stringify(leaderboard, null, 2), 'utf-8')