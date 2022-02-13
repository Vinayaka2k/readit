require('dotenv').config()
const cloudinary = require('cloudinary').v2

let PORT = process.env.PORT
let SECRET = process.env.SECRET
let MONGODB_URI = process.env.MONGODB_URI

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,    
    api_key: process.env.CLOUDINARY_API_KEY,         
    api_secret: process.env.CLOUDINARY_API_SECRET        
})

module.exports = {
    PORT,
    MONGODB_URI,
    SECRET,
    cloudinary
}