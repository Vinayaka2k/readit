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
    if(!img || !img.imageLink || !img.imageId)
        throw new Error(`Image Link and ID are required for post type 'Image' `)
    return img
}

const postTypeValidator = bodyObj => {
    switch(bodyObj.postType){
        case 'Text' : 
            return {
                postType : 'Text',
                textSubmission : parseTextSubmission(bodyObj.textSubmission)
            }
        case 'Link' : return {
            postType : 'Link',
            linkSubmission : parseLinkSubmission(bodyObj.linkSubmission)
        }
        case 'Image' : return {
            postType : 'Image',
            imageSubmission : parseImageSubmission(bodyObj.imageSubmission)
        }
        default : 
            throw new Error('Invalid post type. Valid types include - Text, Link or Image')
    }
}

module.exports = postTypeValidator