import { sendAction } from './apiRoutes'

export const YOUTUBE_ACTION_MESSAGE: string = "YOUTUBE_ACTION_MESSAGE"

export const addYoutubeActionListener = () => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            const requestBody = getActionRequestBody(details)
            let action: string = requestBody["actions"][0]["action"]
            let postLinkKey: string
            if (action.includes("ADD_VIDEO")) {
                action = "save"
                postLinkKey = "addedVideoId"
            }
            else {
                action = "unsave"
                postLinkKey = "removedVideoId"
            }
            let postLink: string = `https://youtube.com/watch?v=${requestBody["actions"][0][postLinkKey]}`
            console.log(`to ${action} post: ${postLink}`)
            sendAction({YOUTUBE_ACTION_MESSAGE, action, postLink})
        },
        {
            urls: [
                "*://*.youtube.com/youtubei/v1/browse/edit_playlist*",
            ]
        },
        [
            "extraHeaders",
            "requestBody"
        ]
    )
}

export const getActionRequestBody = (details: chrome.webRequest.WebRequestBodyDetails) => {
    if (details.requestBody && details.requestBody.raw) {
        const data = details.requestBody.raw
            .filter(item => item.bytes)
            .map(item => Array.from(new Uint8Array(item.bytes!)))
            .flat()
        const requestBody = JSON.parse(String.fromCharCode(...data))
        return requestBody
    }
    return undefined
}