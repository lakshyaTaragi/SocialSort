let comments: Element[] = [];

function attemptToPopulateComments(): void {
    console.log("*** trying to load comments again...");
    const allComments = Array.from(document.querySelectorAll('ytd-comment-thread-renderer, ytm-comment-thread-renderer'));
    comments = allComments;
    console.log(`*** comments length = ${comments.length}`);
}

function handleDOM(initialLoadingCompleted: boolean): void {
    if (initialLoadingCompleted) {
        comments = [] // empty the comments (facilitates reel scrolling)
        console.log("*** initial loading completed");
        attemptToPopulateComments();
        return;
    }

    if (comments.length === 0) {
        let attempts = 0;
        const maxAttempts = 5;
        const attemptInterval = 2000; // milliseconds
    
        function attemptLoad() {
            if (comments.length === 0 && attempts < maxAttempts) {
                attemptToPopulateComments();
                attempts++;
                setTimeout(attemptLoad, attemptInterval);
            } else if (comments.length > 0) {
                console.log("*** Comments loaded successfully");
            } else {
                console.log("*** Failed to load comments after maximum attempts");
            }
        }
        // Start the attempts in the background
        setTimeout(attemptLoad, 2000);
    } else {
        setTimeout(attemptToPopulateComments, 2000);
    }

}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TARGET_PAGE_LOADED") {
        console.log("Target page loaded:", JSON.stringify(message));
        handleDOM(true);
    } else if (message.type === "NETWORK_CALL_DETECTED") {
        console.log("*** Network call detected:", JSON.stringify(message));
        handleDOM(false);
    }
});