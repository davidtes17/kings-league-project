import { TEAMS, writeDBFile } from '../db/index.js'
import { logError, logInfo, logSuccess } from './log.js'
import { MVP_PAGE, cleanText } from './utils.js'

async function getMVP() {
    const $ = await MVP_PAGE
    const $rows = $('table tbody tr')

    const MVP_SELECTORS = {
        rank: { selector: '.fs-table-text_1', typeOf: 'number' },
        team: { selector: '.fs-table-text_3', typeOf: 'string' },
        player: { selector: '.fs-table-text_4', typeOf: 'string' },
        games: { selector: '.fs-table-text_5', typeOf: 'number' },
        mvps: { selector: '.fs-table-text_6', typeOf: 'number' }
    }

    function getImageFromTeam({ name }) {
        const { image } = TEAMS.find(team => team.name === name)
        return image
    }

    const mvps = []
    $rows.each((_, item) => {
        const $item = $(item)

        const mvpEntries = Object.entries(MVP_SELECTORS)
            .map(([key, { selector, typeOf }]) => {
                const rawValue = $item.find(selector).text()
                let cleanValue = cleanText(rawValue);

                const value = typeOf === 'number'
                    ? Number(cleanValue)
                    : cleanValue

                return [key, value]
            })

        let mvpObject = Object.fromEntries(mvpEntries)
        mvpObject.image = getImageFromTeam({ name: mvpObject.team })
        mvps.push(mvpObject)
    })

    return mvps
}

try {
    logInfo('Scraping MVPs...')
    const mvps = await getMVP()
    logSuccess('MVPs scraped successfully!')
    logInfo('Writing MVPs to DB...')
    await writeDBFile('mvp', mvps)
    logSuccess('MVPs written to DB successfully!')
} catch (error) {
    logError(error)
}