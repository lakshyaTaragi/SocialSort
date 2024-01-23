chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        fetch("http://localhost:8000/hi")
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
    }
})