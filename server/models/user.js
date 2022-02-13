const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const schemaCleaner = require('../utils/schemaCleaner')

const userSchema = new mongoose.Schema(
    {
        username : {
            type: String,
            minlength: 3,
            maxlength: 20,
            required: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        posts : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.plugin(uniqueValidator)
schemaCleaner(userSchema)
module.exports = mongoose.model('User', userSchema)