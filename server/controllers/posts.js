const router = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const {auth} = require('../utils/middleware')
const {cloudinary} = require('../utils/config')
const postTypeValidator = require('../utils/postTypeValidator')

router.get('/', async (req, res) => {
    const allPosts = await Post.find({})
    res.status(200).json(allPosts)
})

router.post('/', auth, async (req, res) => {
    const {title, subreddit} = req.body
    const postSubmission = postTypeValidator(req.body)
})

module.exports = router