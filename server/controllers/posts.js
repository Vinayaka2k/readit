const router = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const {auth} = require('../utils/middleware')
const {cloudinary} = require('../utils/config')
const postTypeValidator = require('../utils/postTypeValidator')
const Subreddit = require('../models/subreddit')

router.get('/', async (req, res) => {
    const allPosts = await Post.find({})
        .populate([{path: 'author', select: 'username'}, {path: 'subreddit', select:'subredditName'}])
    res.status(200).json(allPosts)
})

router.post('/', auth, async (req, res) => {
    const {title, subreddit, postType, textSubmission, linkSubmission, imageSubmission} = req.body
    const validatedFields = postTypeValidator(postType, textSubmission, linkSubmission, imageSubmission)
    const author = await User.findById(req.user)
    if(!author)
        return res.status(404).send({message: 'User doesnot exist in database'})
    const targetSubreddit = await Subreddit.findById(subreddit)
    if(!targetSubreddit)
        return res.status(404).send({message: `Subreddit with ${subreddit} doesnot exits in Database`})
    
        const newPost = new Post({
        title,
        subreddit,
        author: author._id,
        upVotedBy: [author._id],
        ...validatedFields
    })
    ///// todo
    const savedPost = await newPost.save()
    targetSubreddit.posts = targetSubreddit.posts.concat(savedPost._id)
    author.posts = author.posts.concat(savedPost._id)

    await targetSubreddit.save()
    await author.save()

    const postToSend = await savedPost
        .populate([{path: 'author', select: 'username'}, {path: 'subreddit', select: 'subredditName'}])

    res.status(201).json(postToSend)
})

module.exports = router