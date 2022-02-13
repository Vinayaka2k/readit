const mongoose = require('mongoose')
const schemaCleaner = require('../utils/schemaCleaner')

const commentSchema = new mongoose.Schema({
    commentedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentBody:{
        type: String,
        trim: true
    },
    replies: [
        {
            repliedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            replyBody: {
                type: String,
                trim: true
            },
            createdAt : {type: Date, default : Date.now},
            updatedAt : {type: Date, default : Date.now}
        }
    ],
    createdAt : {type: Date, default : Date.now},
    updatedAt : {type: Date, default : Date.now}
})

const postSchema = new mongoose.Schema({
        title : {
            type: String,
            required: true,
            maxlength: 40,
            trim: true
        },
        mainContent : {
            postType : {
                type : String,
                required: true
            },
            textSubmission : {
                type : String,
                trim : true
            },
            linkSubmission : {
                type : String,
                trim : true
            },
            imageSubmission : {
                imageLink : {
                    type : String,
                    trim : true
                },
                image_id : {
                    type : String,
                    trim : true
                }
            }
        },
        subreddit : {
            type : String,
            trim: true,
            required: true
        },
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        upvotedBy : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ],
        downvotedBy : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ],
        pointsCount : {
            type : Number,
            required : true,
            default : 1
        },
        comments : [commentSchema]
    },
    {
        timestamps : true
    }
)

schemaCleaner(postSchema)
schemaCleaner(commentSchema)

module.exports = mongoose.model('Post', postSchema)