console.log("domain: " + document.domain)

const clickListener = (e: Event) => {
    e.preventDefault()
    const clickedElement = e.target as HTMLElement
    console.log("Clicked: " + clickedElement)
    console.log("InnterHTML: " + clickedElement.innerHTML)
}

document.body.addEventListener('click', clickListener)
console.log("Added Event Listener")