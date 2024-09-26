const isTargetUrl = (url: string): boolean => {
    const youtubeShortRegex = /^(http|https):\/\/[^\/]+\.youtube\.com\/shorts\/.*$/
    const youtubeWatchRegex = /^(http|https):\/\/[^\/]+\.youtube\.com\/watch\?.*$/
  
    return youtubeShortRegex.test(url) || youtubeWatchRegex.test(url)
}

export const addYoutubeActionListener = () => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && isTargetUrl(tab.url as string)) {
            chrome.tabs.sendMessage(tabId, {
                type: "TARGET_PAGE_LOADED",
                url: tab.url
            })
        }
    })

    chrome.webRequest.onCompleted.addListener(
        (details) => {
            // https://www.youtube.com/youtubei/v1/next?prettyPrint=false
            // https://www.youtube.com/youtubei/v1/browse?prettyPrint=false --> also made 
            // when more video items are loaded on the feed
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && isTargetUrl(tabs[0].url as string)) {
                    chrome.tabs.sendMessage(tabs[0].id as number, {
                        type: "NETWORK_CALL_DETECTED",
                        url: details.url,
                        method: details.method,
                    })
                }
            })
        },
        {
            urls: [
                "*://*.youtube.com/youtubei/v1/next*",
                "*://*.youtube.com/youtubei/v1/browse*",
            ]
        }
    )
}


