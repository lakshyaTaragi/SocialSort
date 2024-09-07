import { getActionRequestBody } from './requestUtils'

export const TWITTER_POST_ACTION_MESSAGE: string = "TWITTER_POST_ACTION_MESSAGE"

const TWITTER_GET_USERNAME_ACTION_MESSAGE: string = "TWITTER_GET_USERNAME_ACTION_MESSAGE"
const TWITTER_LINGO_TO_SAVE: string = "CreateBookmark"

export const addTwitterActionListener = () => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            // determine action type based on url of request
            const urlParts = details?.url?.split("/")
            const action: string = urlParts[urlParts.length - 1] === TWITTER_LINGO_TO_SAVE ? "save" : "unsave"

            // extract the request body from raw bytes 
            const requestBody = getActionRequestBody(details)

            // extract the postId based on the structure of requestBody
            const postId: string | undefined = requestBody?.variables?.tweet_id

            // send message to twitterContentScript to look for the username associated with this postId
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (tabs) => {
                if (tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        messageType: TWITTER_GET_USERNAME_ACTION_MESSAGE,
                        postId
                    }, (response) => {
                        console.log(`### to ${action} post https://x.com/${response.username}/status/${postId}`)
                    })
                }
            })
        },
        {
            urls: [
                "*://x.com/i/api/graphql/*/*Bookmark"
            ]
        },
        [
            "extraHeaders",
            "requestBody"
        ]
    )
}

