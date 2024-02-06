import { sendAction } from "./apiRoutes"

export const REDDIT_POST_ACTION_MESSAGE: string = "REDDIT_POST_ACTION_MESSAGE"
export const REDDIT_COMMENT_ACTION_MESSAGE: string = "REDDIT_COMMENT_ACTION_MESSAGE"

export const addRedditActionListener = () => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            const requestBody = details?.requestBody
            let action: string | undefined = details?.url?.split('/')?.pop()?.split('?')[0]
            let postId: string | undefined = requestBody?.formData?.id[0] as string | undefined
            if (postId && action) {
                let postLink: string
                let actionType: string
                let commentId: string | undefined = undefined
                let parts: string[] = postId.split('_')

                if (parts[0] === 't1') {
                    // assuming that comments can only be viewed from the post page and not feed
                    actionType = REDDIT_COMMENT_ACTION_MESSAGE
                    commentId = parts[1]
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs && tabs[0]) {
                            postId = tabs[0]?.url?.split("comments/")[1]?.split("/")[0]
                            postLink = `https://www.reddit.com/comments/${postId}/comment/${commentId}`
                            console.log(`to ${action} comment ${commentId}: ${postLink}`)
                            sendAction(actionType, (action as string), postLink)
                        }
                    })
                }
                else {
                    actionType = REDDIT_POST_ACTION_MESSAGE
                    postId = parts[1]
                    postLink = `https://www.reddit.com/comments/${postId}/`
                    console.log(`to ${action} post: ${postLink}`)
                    sendAction(actionType, (action as string), postLink)
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
