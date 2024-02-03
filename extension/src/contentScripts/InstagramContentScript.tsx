console.log("domain: " + document.domain)

const clickListener = (e: Event) => {
    e.preventDefault()
    const clickedElement = e.target as HTMLElement
    console.log("Clicked: " + clickedElement)
    console.log("InnterHTML: " + clickedElement.innerHTML)
}

document.body.addEventListener('click', clickListener)
console.log("Added Event Listener")

// As soon we add the following, the context of 'document' changes from main page to popup page
// also leads to some ignorable (for now) errors

const InstagramContentScript = () => {
    return (
        <div>InstagramContentScript</div>
    )
}

export default InstagramContentScript