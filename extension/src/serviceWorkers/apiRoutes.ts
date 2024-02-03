interface ApiResponse {
    message: string,
    success: boolean
}

export const sendAction = (type: string, action: string, postLink: string) => {
    const apiURL = "http://localhost:8000/action/"
    const data = { type, action, postLink }
    const reqOptions: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    fetch(apiURL, reqOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`)
            }
            return res.json()
        })
        .then((data: ApiResponse) => {
            console.log(`From YT service worker: ${JSON.stringify(data)}`)
        })
}