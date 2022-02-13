const mongoose = require('mongoose')
const schemaCleaner = require('../utils/schemaCleaner')
const uniqueValidator = require('mongoose-unique-validator')

const subredditSchema = new mongoose.Schema(
    {
        subredditName : {
            type: String,
            required: true,
            trim: true,
            unique: true
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
        subscriberCount : {
            type: Number,
            default: 1
        }
    },
    {
        timestamps : true
    }
)

subredditSchema.plugin(uniqueValidator)
schemaCleaner(subredditSchema)
module.exports = mongoose.model('Subreddit', subredditSchema)