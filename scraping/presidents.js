import path from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'

const DB_PATH = path.join(process.cwd(), './db/')
const STATICS_PATH = path.join(process.cwd(), 'assets/static/presidents/')
const RAW_PRESIDENTS = await readFile(`${DB_PATH}/raw-presidents.json`, 'utf-8').then(JSON.parse)
const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse)

const promises = RAW_PRESIDENTS.map(async presidentInfo => {
    const { slug: id, title, _links: links } = presidentInfo
    const { rendered: name } = title

    // Get image url
    const { 'wp:attachment': attachment } = links
    const { href: imageApiEndpoint } = attachment[0]

    const resImageEndpoint = await fetch(imageApiEndpoint)
    const data = await resImageEndpoint.json()
    const [imageInfo] = data
    const { guid: { rendered: imageUrl } } = imageInfo

    const fileExtension = imageUrl.split('.').at(-1)

    // Download image
    const responseImage = await fetch(imageUrl)
    const arrayBuffer = await responseImage.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const imageFileName = `${id}.${fileExtension}`
    await writeFile(`${STATICS_PATH}/${imageFileName}`, buffer)

    // Get the teamId
    const { id: teamId } = TEAMS.find(team => team.presidentId === id)

    return { id, name, image: imageFileName, teamId }
})

const presidents = await Promise.all(promises)
await writeFile(`${DB_PATH}/presidents.json`, JSON.stringify(presidents, null, 2))