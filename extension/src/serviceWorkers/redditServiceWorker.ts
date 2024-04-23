import * as cheerio from "cheerio"
import { sendAction } from "./apiRoutes"

import { getActionRequestBody } from "./youtubeServiceWorker"

export const REDDIT_POST_ACTION_MESSAGE: string = "REDDIT_POST_ACTION_MESSAGE"
export const REDDIT_COMMENT_ACTION_MESSAGE: string = "REDDIT_COMMENT_ACTION_MESSAGE"

export const addRedditActionListener = () => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (details?.method !== "POST") {
                // avoiding form decoding calls  
                return
            }
            const requestBody = getActionRequestBody(details)
            if (!(requestBody?.operation === "UpdatePostSaveState" || requestBody?.operation === "UpdateCommentSaveState")) {
                return
            }
            let action: string | undefined = requestBody?.variables?.input?.saveState
            if (!action) {
                return
            } else {
                action = action === "NONE" ? "unsave" : "save"
            }
            let postId: string | undefined = requestBody?.variables?.input?.postId // t3_<id>
            let commentId: string | undefined = requestBody?.variables?.input?.commentId // t1_<id>
            if (commentId) {
                commentId = commentId.split("_")[1]
                // assuming that comments can only be viewed from the post page and not feed
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    if (tabs && tabs[0]) {
                        //* postLink: https://www.reddit.com/r/<subreddit_name>/comments/<post_id>/<title_with_underscores>/
                        //* commentLink: https://www.reddit.com/r/<subreddit_name>/comments/<post_id>/comment/<commentId>/
                        let postLink: string | undefined = tabs[0].url
                        if (postLink) {
                            let commentLink = getCommentLinkFromPostLink(postLink, commentId as string)
                            console.log(`to ${action} comment ${commentId}: ${commentLink}`)
                            sendAction({ REDDIT_COMMENT_ACTION_MESSAGE, action, commentLink })
                        }
                        else {
                            console.log("Did not find postLink from active tab")
                        }
                    }
                })
            }
            else if (postId) {
                // posts can be saved from the feed page too so we get the full link by scraping
                postId = postId.split("_")[1]
                let postLink: string = `https://www.reddit.com/comments/${postId}/`
                getFullPostLink(postLink).then(
                    (fullPostLink) => {
                        console.log(`to ${action} post: ${fullPostLink}`)
                        sendAction({ REDDIT_POST_ACTION_MESSAGE, action, fullPostLink })
                    }
                )
            }
        },
        {
            urls: [
                "*://*.reddit.com/svc/shreddit/graphql"
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
        fullPostLink = `https://www.reddit.com${$('shreddit-redirect').attr('href')}`
    }
    catch (err) {
        console.log((err as Error).message)
    }
    return fullPostLink
}


const getCommentLinkFromPostLink = (postLink: string, commentId: string): string => {
    let cnt = 0
    let commentLink = ""
    for (let i = postLink.length - 1; i >= 0; i--) {
        if (postLink[i] === '/') {
            cnt++
            if (cnt == 2) {
                commentLink = `${postLink.substring(0, i)}/${commentId}`
                break
            }
        }
    }
    return commentLink
}