import { RAW_PRESIDENTS, TEAMS, writeDBFile, writeStaticFile } from "../db/index.js"

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
    await writeStaticFile(`presidents/${imageFileName}`, buffer)

    // Get the teamId
    const { id: teamId } = TEAMS.find(team => team.presidentId === id)

    return { id, name, image: imageFileName, teamId }
})

const presidents = await Promise.all(promises)
await writeDBFile('presidents', presidents)