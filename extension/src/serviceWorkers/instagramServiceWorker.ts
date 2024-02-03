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

// X-Fb-Friendly-Name: usePolarisSaveMediaUnsaveMutation
// X-Fb-Friendly-Name: usePolarisSaveMediaSaveMutation
// Referer: https://www.instagram.com/p/C24aKgVvB-g/

// "*://*.instagram.com/api/graphql"
// https://www.instagram.com/api/v1/web/save/2082897083857397469/save/
// https://www.instagram.com/api/v1/web/save/3293218109670333231/unsave/
// Referer: https://www.instagram.com/p/C24aKgVvB-g/