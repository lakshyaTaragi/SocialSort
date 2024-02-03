const maxLeaps: number = 2
const maxUpMoves: number = 100
const minLeaps: number = 0
let action: string | undefined = undefined
let postLink: string | undefined = undefined
let currentElement: HTMLElement | null = null

// export const INSTAGRAM_ACTION_MESSAGE: string = "INSTAGRAM_ACTION_MESSAGE"
const INSTAGRAM_ACTION_MESSAGE: string = "INSTAGRAM_ACTION_MESSAGE"

const postIdRegex: RegExp = /\/(p|reel(s)?)\/(.*?)\//

const isSpecialSVG = (element: HTMLElement | null): string | undefined => {
    if (element?.nodeName.toLowerCase() === "svg") {
        let childNode = element.firstChild as HTMLElement | null
        if (childNode?.nodeName.toLowerCase() === "title") {
            switch (childNode.textContent?.toLowerCase()) {
                case "save":
                    return "save"
                case "remove":
                    return "unsave"
                default:
                    return undefined
            }
        }
        
    }
    return undefined
}


const clickListener = (e: Event) => {
    e.preventDefault()
    action = undefined
    postLink = undefined
    currentElement = null
    const clickedElement = e.target as HTMLElement

    // clicked the title or the path  
    action = isSpecialSVG(clickedElement.parentElement)
    if (action) {
        currentElement = clickedElement.parentElement
    }
    else {
        // withing 0-2 leaps downwards, the element should reach specialSVG
        let remainingLeaps: number = maxLeaps
        let checkingElement: HTMLElement | null = clickedElement
        while (checkingElement && remainingLeaps >= minLeaps) {
            action = isSpecialSVG(checkingElement)
            if (action) {
                currentElement = checkingElement
                break
            }
            remainingLeaps--
            checkingElement = checkingElement.firstElementChild as HTMLElement | null
        }
    }

    if (currentElement) {
        // Move upwards while looking for `postIdRegex`
        let remaingUpMoves: number = maxUpMoves
        while (currentElement && remaingUpMoves > 0) {
            currentElement = (currentElement as HTMLElement)
            const matches = postIdRegex.exec(currentElement.innerHTML)
            if (matches && matches[0]) {
                postLink = `https://instagram.com${matches[0]}`
                break
            }
            else {
                remaingUpMoves--
                currentElement = currentElement.parentElement
            }
        }
        if (postLink) {
            console.log(`to ${action} post: ${postLink}`)
            chrome.runtime.sendMessage({
                messageType: INSTAGRAM_ACTION_MESSAGE,
                action,
                postLink
            })
        }
        else {
            console.log("postLink was not found, something is wrong")
        }
    }
}

document.body.addEventListener('click', clickListener)
console.log("Added Click Event Listener")