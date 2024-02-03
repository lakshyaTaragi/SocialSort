
const maxLeaps: number = 2
const maxUpMoves: number = 100
const minLeaps: number = 0
let action: string | undefined = undefined
let postLink: string | undefined = undefined
let currentElement: HTMLElement | null = null

const postIdRegex: RegExp = /\/(p|reel(s)?)\/(.*?)\//

const printInnerHTML = (element: HTMLElement | null | undefined): string => {
    let toPrint: string = element?.innerHTML.substring(0, Math.min(element.innerHTML.length, 50)) || ""
    return toPrint
}

const isSpecialSVG = (element: HTMLElement | null): string | undefined => {
    if (element) {
        console.log(`checking for: ${element}(${element.nodeName}) --> ${printInnerHTML(element)}` )
    }
    if (element?.nodeName.toLowerCase() === "svg") {
        console.log("   * nodeName is svg")
        let childNode = element.firstChild as HTMLElement | null
        console.log(`childNode is : ${childNode}(${childNode?.nodeName || "**"}) --> ${printInnerHTML(childNode)}` )
        if (childNode?.nodeName.toLowerCase() === "title") {
            console.log("       ** element is title")
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
    console.log(`you clicked: ${clickedElement} --> ${printInnerHTML(clickedElement)}` )
    console.log(`parent is : ${clickedElement.parentElement} --> ${printInnerHTML(clickedElement.parentElement)}` )
    console.log(`grandparent is : ${clickedElement.parentElement?.parentElement} --> ${printInnerHTML(clickedElement.parentElement?.parentElement)}` )

    // clicked the title or the path  
    action = isSpecialSVG(clickedElement.parentElement)
    if (action) {
        console.log("found shuru mein hi")
        currentElement = clickedElement.parentElement
    }
    else {
        console.log("need to look more")
        // withing 0-2 leaps downwards, the element should reach specialSVG
        let remainingLeaps: number = maxLeaps
        let checkingElement: HTMLElement | null = clickedElement
        while (checkingElement && remainingLeaps >= minLeaps) {
            action = isSpecialSVG(checkingElement)
            if (action) {
                console.log("found now, action = " + action)
                currentElement = checkingElement
                break
            }
            remainingLeaps--
            checkingElement = checkingElement.firstElementChild as HTMLElement | null
            console.log("did not find, going down, moves remaning: " + remainingLeaps)
        }
    }

    if (currentElement) {
        // Move upwards while looking for `postIdRegex`
        let remaingUpMoves: number = maxUpMoves
        while (currentElement && remaingUpMoves > 0) {
            console.log(`looking into: ${currentElement} --> ${printInnerHTML(currentElement)}` )
            currentElement = (currentElement as HTMLElement)
            const matches = postIdRegex.exec(currentElement.innerHTML)
            console.log("***" + matches + "***")
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
            // TODO: communicate info to instagramServiceWorker
            console.log(`to ${action} post: ${postLink}`)
        }
        else {
            console.log("postLink was not found, something is wrong")
        }
    }
}

document.body.addEventListener('click', clickListener)
console.log("Added Click Event Listener")