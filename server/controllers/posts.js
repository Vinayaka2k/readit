const router = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const {auth} = require('../utils/middleware')
const {cloudinary} = require('../utils/config')
const postTypeValidator = require('../utils/postTypeValidator')
const Subreddit = require('../models/subreddit')
const paginatedResults = require('../utils/paginatedResults')

router.get('/new', async (req, res) => {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const postsCount = await Post.countDocuments()
    const paginated = paginatedResults(page, limit, postsCount)
    const allPosts = await post.find({}).populate({path:'author', select:'username'})
    const paginatedPosts = {
        previous: paginated.results.previous,
        results: allPosts,
        next: paginated.results.next
    }
    res.status(200).json(paginatedPosts)
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

router.patch('/:id', auth, async (req, res) => {
    const {textSubmission, linkSubmission, imageSubmission} = req.body
    
    const post = await Post.findById(req.params.id)
    const author = await User.findById(req.user)
    
    if(!post)
        return res.status(404).send({message: `Post with id ${req.params.id} doesnt exist in database`})
    if(!author)
        return res.status(404).send({message: `User doesnot exist in Database`})

    if(post.author.toString() !== author._id.toString())
        return res.status(401).send({message: 'Access is denied'})
    //// todo
    await post.save()
    res.status(202).json(post)
})

app.delete('/:id', auth, async () => {
    const post = await Post.findById(req.params.id)
    const author = await User.findById(req.user)

    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exits in DB`})
    if(!author)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    if(post.author.toString() !== author._id.toString())
        return res.status(401).send({message: 'Access is denied'})
    
    const subreddit = await Subreddit.findById(post.subreddit)
    if(!subreddit)
        return res.status(404).send({message: `Subreddit with ${subreddit._id} doesnot exist in database`})

    await Post.findByIdAndDelete(req.params.id)

    subreddit.posts = subreddit.posts.filter(p => p.toString() !== req.params.id)
    author.posts = author.posts.filter(p => p.toString() !== req.params.id)

    await subreddit.save()
    await author.save()

    res.status(204).end()
})

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    if(!post)
        return res.status(400).send({message: `Post with id ${req.params.id} doesnt exist in database`})
    const populatedPost = post.populate([
            {path: 'author', select: 'username'},
            {path: 'subreddit', select: 'subredditName'},
            {path: 'comments.commentedBy', select: 'username'},
            {path: 'comments.replies.repliedBy', select: 'username'}
        ])
        return res.status(200).json(populatedPost)
})

module.exports = router