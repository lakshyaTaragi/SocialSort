const TWITTER_GET_USERNAME_ACTION_MESSAGE: string = "TWITTER_GET_USERNAME_ACTION_MESSAGE"

// dynamically generate the regex to look for using postId
// format: "/<username>/status/<postId>"
const getTwitterPostLinkRegex = (postId: string): RegExp => {
    const postLinkRegExp = new RegExp(`href="\\/([^\\/]+)\\/status\\/${postId}"`, "g")
    return postLinkRegExp
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    // to determine further action
    const { messageType } = message
    if (messageType === TWITTER_GET_USERNAME_ACTION_MESSAGE) {
        // find the creator of a given post

        // post whose creator needs to be found
        const { postId } = message

        // obtain regex for url
        const postLinkRegExp = getTwitterPostLinkRegex(postId)

        // look in html content of page
        const match = document.body.innerHTML.match(postLinkRegExp)

        if (match) {
            // extract the username and respond to twitterServiceWorker
            const username: string = match[0].split(`href="/`)[1].split("/")[0]
            sendResponse({
                username
            })
        }

    }
})




