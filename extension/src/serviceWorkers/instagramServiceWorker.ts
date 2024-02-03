import { sendAction } from './apiRoutes'

const INSTAGRAM_ACTION_MESSAGE: string = "INSTAGRAM_ACTION_MESSAGE"

export const addInstagramActionListener = () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { messageType } = message
        if (messageType === INSTAGRAM_ACTION_MESSAGE) {
            const { action, postLink } = message
            console.log(`to ${action} post: ${postLink}`)
            sendAction(messageType, action, postLink)
        }
    })
}
