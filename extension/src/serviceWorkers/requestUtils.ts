export const getActionRequestBody = (details: chrome.webRequest.WebRequestBodyDetails) => {
    if (details.requestBody && details.requestBody.raw) {
        const data = details.requestBody.raw
            .filter(item => item.bytes)
            .map(item => Array.from(new Uint8Array(item.bytes!)))
            .flat()
        const requestBody = JSON.parse(String.fromCharCode(...data))
        return requestBody
    }
    return undefined
}