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

router.post('/:id/downvote', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)

    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exits in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})

    if(post.downVotedBy.includes(user._id.toString()))
        post.downVotedBy = post.downVotedBy.filter(d => d.toString() !== user._id.toString())
    else{
        post.downVotedBy = post.downVotedBy.concat(user._id)
        post.upVotedBy = post.upVotedBy.filter(u => u.toString() !== user._id.toString())
    }
    const calculatedPoints = post.upVotedBy.length - post.downVotedBy.length
    if(calculatedPoints < 0)
        post.pointsCount = 0                // can this be allowed to be negative ?
    else
        post.pointsCount = calculatedPoints
    await post.save()
    res.status(201).end()
})

router.post('/:id/upvote', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)

    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exits in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})

    if(post.upVotedBy.includes(user._id.toString()))            // already upvoted
        post.upVotedBy = post.upVotedBy.filter(u => u.toString() !== user._id.toString())
    else {                                                      // already downvoted OR not voted yet
        post.upVotedBy = post.upVotedBy.concat(user._id)
        post.downVotedBy = post.downVotedBy.filter(d => d.toString() !== user._id.toString())
    }
    const calculatedPoints = post.upVotedBy.length - post.downVotedBy.length
    if(calculatedPoints < 0)
        post.pointsCount = 0                // can this be allowed to be negative ?
    else
        post.pointsCount = calculatedPoints
    await post.save()
    res.status(201).end()
})

router.post('/:id/comment', auth, async (req, res) => {
    if(!req.body.comment)
        return res.status(400).send({message: 'Comment body cant be empty!'})
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)

    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exits in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})

    post.comments = post.comments.concat({
        commentedBy: user._id,
        commentBody: comment
    })
    const savedPost = await post.save()
    const populatedPost = await savedPost.populate([{path: 'author', select: 'username'}, {path: 'subreddit', select: 'subredditName'}, {path: 'comments.commentedBy', select: 'username'}])
    res.status(201).json(populatedPost)
})

router.delete('/:id/comment/:commentId', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)

    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exist in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const targetComment = post.comments.find( c => c._id.toString() === req.params.commentId)
    if(!targetComment)
        return res.status(404).send({message: `Comment with id ${req.params.commentId} doesnt exist in database`})
    if(targetComment.commentedBy.toString() !== user._id.toString())
        return res.status(401).send({message : 'Access is denied'})
    
    post.comments = post.comments.filter( c => c._id.toString() !== req.params.commentId)
    await post.save()
    return res.status(204).end()
})

router.patch('/:id/comment/:commentId', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)
    
    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exist in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const targetComment = post.comments.find( c => c._id.toString() === req.params.commentId)
    if(!targetComment)
        return res.status(404).send({message: `Comment with id ${req.params.commentId} doesnt exist in database`})
    if(targetComment.commentedBy.toString() !== user._id.toString())
        return res.status(401).send({message : 'Access is denied'})
    
    targetComment.commentBody = req.body.comment
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    const savedPost = await post.save()
    const populatedPost = savedPost.populate([
        {path: 'author', select: 'username'},
        {path: 'subreddit', select: 'subredditName'},
        {path: 'comments.commentedBy', select: 'username'},
        {path: 'comments.replies.repliedBy', select: 'username'}
    ])
    res.status(202).json(populatedPost)
})

router.post('/:id/comment/:commentId/reply', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)
    if(!req.body.reply)
        return res.status(400).send({message: 'Reply body cant be empty'})
    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exist in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const targetComment = post.comments.find( c => c._id.toString() === req.params.commentId)
    if(!targetComment)
        return res.status(404).send({message: `Comment with id ${req.params.commentId} doesnt exist in database`})
    
    targetComment.replies = targetComment.replies.concat({
        replyBody : req.body.reply,
        repliedBy: user._id
    })

    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    const savedPost = await post.save()
    const populatedPost = savedPost.populate([
        {path: 'author', select: 'username'},
        {path: 'subreddit', select: 'subredditName'},
        {path: 'comments.commentedBy', select: 'username'},
        {path: 'comments.replies.repliedBy', select: 'username'}
    ])
    res.status(201).json(populatedPost)
})

router.delete('/:id/comment/:commentId/reply/:replyId', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)
    
    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exist in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const targetComment = post.comments.find( c => c._id.toString() === req.params.commentId)
    if(!targetComment)
        return res.status(404).send({message: `Comment with id ${req.params.commentId} doesnt exist in database`})
    
    const targetReply = targetComment.replies.find( r => r._id.toString() === req.params.replyId)
    if(!targetReply)    
        return res.status(404).send({message: `Reply to Comment with id ${req.params.replyId} doesnt exist in database`})
    
    if(targetReply.repliedBy.toString() != user._id.toString())
        return res.status(401).send({message: 'Access is denied'})
    
    targetComment.replies = targetComment.replies.filter(r => r._id.toString() !== req.params.replyId)
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    await post.save()
    return res.status(204).end()
})

router.patch('/:id/comment/:commentId/reply/:replyId', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)
    
    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exist in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const targetComment = post.comments.find( c => c._id.toString() === req.params.commentId)
    if(!targetComment)
        return res.status(404).send({message: `Comment with id ${req.params.commentId} doesnt exist in database`})
    
    const targetReply = targetComment.replies.find( r => r._id.toString() === req.params.replyId)
    if(!targetReply)    
        return res.status(404).send({message: `Reply to Comment with id ${req.params.replyId} doesnt exist in database`})
    
    if(targetReply.repliedBy.toString() != user._id.toString())
        return res.status(401).send({message: 'Access is denied'})
    
    if(req.body.reply)
        targetReply.replyBody = req.body.reply

    targetComment.replies = targetComment.replies.map(r => r._id.toString() !== req.params.replyId ? r : targetReply)
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    const savedPost = await post.save()
    const populatedPost = savedPost.populate([
        {path: 'author', select: 'username'},
        {path: 'subreddit', select: 'subredditName'},
        {path: 'comments.commentedBy', select: 'username'},
        {path: 'comments.replies.repliedBy', select: 'username'}
    ])
    return res.status(202).json(populatedPost)
})

module.exports = router