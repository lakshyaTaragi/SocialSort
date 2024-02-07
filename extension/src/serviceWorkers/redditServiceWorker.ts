import * as cheerio from "cheerio"
import { sendAction } from "./apiRoutes"

export const REDDIT_POST_ACTION_MESSAGE: string = "REDDIT_POST_ACTION_MESSAGE"
export const REDDIT_COMMENT_ACTION_MESSAGE: string = "REDDIT_COMMENT_ACTION_MESSAGE"

export const addRedditActionListener = () => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            const requestBody = details?.requestBody
            let action: string | undefined = details?.url?.split('/')?.pop()?.split('?')[0]
            let itemId: string | undefined = requestBody?.formData?.id[0] as string | undefined
            if (itemId && action) {
                let actionType: string
                let parts: string[] = itemId.split('_')

                if (parts[0] === 't1') {
                    // assuming that comments can only be viewed from the post page and not feed
                    actionType = REDDIT_COMMENT_ACTION_MESSAGE
                    let commentId: string = parts[1]
                    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                        if (tabs && tabs[0]) {
                            let postId = tabs[0]?.url?.split("comments/")[1]?.split("/")[0]
                            let postLink: string | undefined = tabs[0].url
                            if (postLink) {
                                let cnt = 0
                                let commentLink: string | undefined
                                for (let i = postLink.length - 1; i >= 0; i--) {
                                    if (postLink[i] === '/') {
                                        cnt++
                                        if (cnt == 2) {
                                            commentLink = `${postLink.substring(0, i)}/comment/${commentId}`
                                            break
                                        }
                                    }
                                }
                                console.log(`to ${action} comment ${commentId}: ${commentLink}`)
                                sendAction({ actionType, action, commentLink })
                            }
                            else {
                                console.log("Did not find postLink from active tab")
                            }
                        }
                    })
                }
                else {
                    actionType = REDDIT_POST_ACTION_MESSAGE
                    let postId: string = parts[1]
                    let postLink: string = `https://www.reddit.com/comments/${postId}/`
                    getFullPostLink(postLink).then(
                        (fullPostLink) => {
                            console.log(`to ${action} post: ${fullPostLink}`)
                            sendAction({ actionType, action, fullPostLink })
                        }
                    )
                }
            }
        },
        {
            urls: [
                "*://*.reddit.com/api/save?redditWebClient=*",
                "*://*.reddit.com/api/unsave?redditWebClient=*"
            ]
        },
        [
            "extraHeaders",
            "requestBody"
        ]
    )
}

const getFullPostLink = async (postLink: string): Promise<string | undefined> => {
    let fullPostLink: string | undefined = undefined
    try {
        const response = await fetch(postLink)
        const bodyText = await response.text()
        const $ = cheerio.load(bodyText)
        fullPostLink = $('link[rel="canonical"]').attr('href')
    }
    catch (err) {
        console.log((err as Error).message)
    }
    return fullPostLink
}
