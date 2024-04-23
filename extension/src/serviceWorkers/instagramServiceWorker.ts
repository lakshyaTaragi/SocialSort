import { sendAction } from './apiRoutes'

const INSTAGRAM_ACTION_MESSAGE: string = "INSTAGRAM_ACTION_MESSAGE"
const GET_URL_MESSAGE: string = "GET_URL_MESSAGE"

export const addInstagramActionListener = () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { messageType } = message
        if (messageType === INSTAGRAM_ACTION_MESSAGE) {
            const { action, postLink } = message
            console.log(`to ${action} post: ${postLink}`)
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
