import { PRESIDENTS, TEAMS, writeDBFile } from '../db/index.js'
import { logInfo, logSuccess, logError } from './log.js'
import { LEADERBOARD_PAGE, cleanText } from './utils.js'

async function getLeaderboard() {
    const $ = await LEADERBOARD_PAGE
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

    function getTeam({ name }) {
        const team = TEAMS.find(team => team.name === name)
        return team
    }

    function getPresident({ teamId }) {
        const president = PRESIDENTS.find(president => president.teamId === teamId)
        return president
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

        let leaderboardObject = Object.fromEntries(leaderboardEntries)
        const teamInfo = getTeam({ name: leaderboardObject.team })
        const presidentInfo = getPresident({ teamId: teamInfo.id })
        leaderboardObject.team = { ...teamInfo, president: presidentInfo }
        leaderboard.push(leaderboardObject)
    })

    return leaderboard
}

try {
    logInfo('Scraping Leaderboard...')
    const leaderboard = await getLeaderboard()
    logSuccess('Leaderboard scraped successfully!')
    logInfo('Writing Leaderboard to DB...')
    await writeDBFile('leaderboard', leaderboard)
    logSuccess('Leaderboard written to DB successfully!')
} catch (error) {
    logError(error)
}