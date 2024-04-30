import * as cheerio from 'cheerio'
import { sendAction } from './apiRoutes'

const INSTAGRAM_ACTION_MESSAGE: string = "INSTAGRAM_ACTION_MESSAGE"
const GET_URL_MESSAGE: string = "GET_URL_MESSAGE"

export const addInstagramActionListener = () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { messageType } = message
        if (messageType === INSTAGRAM_ACTION_MESSAGE) {
            const { action, postLink } = message
            console.log(`to ${action} post: ${postLink}`)
            getInstagramCreatorFromPostLink(postLink)
            sendAction({ messageType, action, postLink })
        }
        else if (messageType === GET_URL_MESSAGE) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (tabs) => {
                const url = tabs[0].url
                // response is sent synchronously
                sendResponse(url)
            })
            // Keep the message channel open
            return true
        }
    })
}

const getInstagramCreatorFromPostLink = async (postLink: string) => {
    const response = await fetch(postLink)
    const bodyText = await response.text()
    const $ = cheerio.load(bodyText)
    const description =$('meta[name="description"]').attr('content')
    const creatorName = description?.split(" on ")[0].split(" - ")[1]
    const creatorLink = `https://instagram.com/${creatorName}`
    console.log("*** creatorName = " + creatorName)
    console.log("*** creatorLink = " + creatorLink)
}
