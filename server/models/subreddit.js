const mongoose = require('mongoose')
const schemaCleaner = require('../utils/schemaCleaner')

const subredditSchema = new mongoose.Schema({
    subredditName : {
        type: String,
        required: true,
        trim: true
    },
    description : {
        type: String,
        required: true,
        trim: true
    },
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Post'
        }
    ],
    admin : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subscribedBy : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    subscribersCount : {
        type: Number,
        required: true
    }
})

schemaCleaner(subredditSchema)
module.exports = mongoose.model('Subreddit', subredditSchema)