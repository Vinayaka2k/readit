const validator = require('validator')

const parseTextSubmission = text => {
    if(!text)
        throw new Error(`Text body needed for post type 'Text'`)
    return text
}

const parseLinkSubmission = link => {
    if(!link || !validator.isURL(link))
        throw new Error(`Valid URL required for post type 'link' `)
    return link
}

const parseImageSubmission = img => {
    if(!img)
        throw new Error(`Image Link and ID are required for post type 'Image' `)
    return img
}

const postTypeValidator = (type, text, link, image) => {
    switch(type){
        case 'Text' : 
            return {
                postType : 'Text',
                textSubmission : parseTextSubmission(text)
            }
        case 'Link' : return {
            postType : 'Link',
            linkSubmission : parseLinkSubmission(link)
        }
        case 'Image' : return {
            postType : 'Image',
            imageSubmission : parseImageSubmission(image)
        }
        default : 
            throw new Error('Invalid post type. Valid types include - Text, Link or Image')
    }
}

module.exports = postTypeValidator