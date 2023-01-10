import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'db')
const STATICS_PATH = path.join(process.cwd(), 'assets/static')

function readDBFile(fileName) {
    return readFile(`${DB_PATH}/${fileName}.json`, 'utf-8').then(JSON.parse)
}

export const TEAMS = await readDBFile('teams')
export const RAW_PRESIDENTS = await readDBFile('raw-presidents')
export const PRESIDENTS = await readDBFile('presidents')

export function writeDBFile(fileName, data) {
    return writeFile(`${DB_PATH}/${fileName}.json`, JSON.stringify(data, null, 2))
}

export function writeStaticFile(fileName, data) {
    return writeFile(`${STATICS_PATH}/${fileName}`, data)
}