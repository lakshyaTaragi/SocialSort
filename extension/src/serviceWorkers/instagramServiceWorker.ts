export const addInstagramSaveUnsaveListener = () => {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            let action: string | undefined = deterMineAction(details)
            let postLink: string | undefined = details.requestHeaders?.find(el => el.name === "Referer")?.value
            if (action && postLink) {
                console.log(`to ${action} post: ${postLink}`)
            }
        },
        {
            urls: [
                "*://*.instagram.com/api/graphql/*",
                "*://*.instagram.com/api/v1/web/save/*"
            ]
        },
        [
            "extraHeaders",
            "requestHeaders"
        ]
    )
}

const deterMineAction = (details: chrome.webRequest.WebRequestHeadersDetails): string | undefined => {
    if (details.url.includes("save")) {
        const parts: string[] = details.url.split('/')
        return parts[parts.length - (parts[parts.length - 1] === "" ? 2 : 1)]
    }
    else {
        const xFbFriendlyName: string | undefined = details.requestHeaders?.find(header => header.value?.includes("usePolarisSaveMedia"))?.value
        if (xFbFriendlyName) {
            return xFbFriendlyName.includes("UnsaveMutation") ? "unsave" : "save"
        }
        return undefined
    }
}