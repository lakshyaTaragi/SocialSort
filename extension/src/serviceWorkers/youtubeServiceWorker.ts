interface ApiResponse {
    message: string,
    code: number,
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        if (tab?.url?.includes("youtube.com")) {
            console.log("This is a youtube page")
            fetch("http://localhost:8000/hi")
                .then(response => response.json())
                .then((data: ApiResponse) => {
                    console.log(`From YT service worker: ${data}`)
                    chrome.tabs.sendMessage(tabId, {
                        type: "youtube_is_on",
                        data,
                    });
                    console.log(`message sent to ${tabId}`)
                })
        }
        else {
            console.log("this is a NOT youtube page")
        }
    }
})