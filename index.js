const { Plugin } = require('elements')
const https = require('https')
const defaultCSS = require('./settings.json')

module.exports = class UDB extends Plugin{
    preload(){
        this.manager.get('react').on('mutation', muts => handleObservation(muts))
    }
    load(){
        this.getUser = getUser
        this.registerSettingsTab('UDB', require('./settings.jsx'))
        let users = document.createElement('style')
        users.id = 'udbStyleUsers'

        document.body.prepend(users)
    }
    unload(){
        deleteElement(document.getElementById('udbStyleUsers'))
    }
}

function handleObservation(muts){
    // Get Mutations
    muts.forEach((mut) => {
        if(mut.addedNodes.length < 1) return

        // Find the right node
        mut.addedNodes.forEach((element) => {
            if (!element.classList) return
            
            // We have the element we needed
            if (element.classList.contains(defaultCSS.popoutClass) || element.classList.contains(defaultCSS.modalClass) ){
                handleUserBackground(element)
            }
        })
    })
}

function deleteElement(el){
    if(el && el.parentElement) el.parentElement.removeChild(el)
}

async function handleUserBackground(element){
    // Get ID for use with UDB
    let id = await getIDfromImage(element)
    await getUser(id)
    let background = element.querySelector(defaultCSS.popoutHeader) || element.querySelector(defaultCSS.modalHeader)
    if(id && background) background.id = `udbUser${id}`
}

function getIDfromImage(element){
    // Get Image
    // I hate these syntaxes
    let image = element.querySelector(defaultCSS.imageSelector) || element.querySelector(defaultCSS.imageSelectorOther)
    if(!image) return

    let style = image.getAttribute('style')
    if(!style) return

    // This can happen?
    let id = style.toString().match(/avatars\/(.*)\//)
    if(!id) return

    // Get and return ID
    return id[1]
}

function handleUserImage(id,image){
    // Reference to the css element
    const userImages = document.getElementById('udbStyleUsers')

    // This should never happen
    if(!userImages) return console.error('UserImages element not found')

    // First check if we already have this user
    if(userImages.innerHTML.includes(id)){

        // User is already there, check for update. And replace
        userImages.innerHTML = userImages.innerHTML.replace(
            new RegExp(`#udbUser${id}{.*}\n`, 'g'),'')

        userImages.innerHTML += `#udbUser${id}{background:url(${image}) center / cover no-repeat !important;}\n`
    }
    else{
        // No user? Create it
        userImages.innerHTML += `#udbUser${id}{background:url(${image}) center / cover no-repeat !important;}\n`
    }
}

function getUser(id){
    https.get({host:`udb.glitch.me`,port:443,path: `/api/v2/get?id=${id}`}, (res) => {
        res.on('data', (data) => {
            try{
                let result = JSON.parse(data.toString('utf8'))
                if(result[0]) handleUserImage(id,result[0].url)
            }
            catch (e)
            {console.log("Couldn't covert string to JSON")}
        })
    })
}