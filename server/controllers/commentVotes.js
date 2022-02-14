const router = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const {auth} = require('../utils/middleware')

router.post('/:id/comment/commentId/upvote', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)
    
    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exist in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const targetComment = post.comments.find( c => c._id.toString() === req.params.commentId)
    if(!targetComment)
        return res.status(404).send({message: `Comment with id ${req.params.commentId} doesnt exist in database`})
    
    const commentAuthor = await User.findById(targetComment.commentedBy)
    if(!commentAuthor)
        return res.status(404).send({message: `Comment author doesnt exist in database`})

    if(targetComment.upvotedBy.includes(user._id.toString())){
        targetComment.upvotedBy = targetComment.upvotedBy.filter( u => u.toString() !== user._id.toString())
        commentAuthor.karmaPoints.commentKarma = commentAuthor.karmaPoints.commentKarma - 1
    }
    else{
        targetComment.upvotedBy = targetComment.upvotedBy.concat(user._id)
        targetComment.downvotedBy = targetComment.downvotedBy.filter(d => d.toString() !== user._id.toString())
        commentAuthor.karmaPoints.commentKarma = commentAuthor.karmaPoints.commentKarma + 1
    }
    targetComment.pointsCount = targetComment.upvotedBy - targetComment.downvotedBy
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    const savedPost = await post.save()
    const populatedPost = savedPost.populate([
        {path: 'author', select: 'username'},
        {path: 'subreddit', select: 'subredditName'},
        {path: 'comments.commentedBy', select: 'username'},
        {path: 'comments.replies.repliedBy', select: 'username'}
    ])
    await commentAuthor.save()
    return res.status(201).json(populatedPost)
})


router.post('/:id/comment/commentId/downvote', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)
    
    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exist in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const targetComment = post.comments.find( c => c._id.toString() === req.params.commentId)
    if(!targetComment)
        return res.status(404).send({message: `Comment with id ${req.params.commentId} doesnt exist in database`})
    
    const commentAuthor = await User.findById(targetComment.commentedBy)
    if(!commentAuthor)
        return res.status(404).send({message: `Comment author doesnt exist in database`})

    if(targetComment.downvotedBy.includes(user._id.toString())){
        targetComment.downvotedBy = targetComment.downvotedBy.filter( u => u.toString() !== user._id.toString())
        commentAuthor.karmaPoints.commentKarma = commentAuthor.karmaPoints.commentKarma + 1
    }
    else{
        targetComment.downvotedBy = targetComment.downvotedBy.concat(user._id)
        targetComment.upvotedBy = targetComment.upvotedBy.filter(d => d.toString() !== user._id.toString())
        commentAuthor.karmaPoints.commentKarma = commentAuthor.karmaPoints.commentKarma - 1
    }
    targetComment.pointsCount = targetComment.upvotedBy - targetComment.downvotedBy
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    const savedPost = await post.save()
    const populatedPost = savedPost.populate([
        {path: 'author', select: 'username'},
        {path: 'subreddit', select: 'subredditName'},
        {path: 'comments.commentedBy', select: 'username'},
        {path: 'comments.replies.repliedBy', select: 'username'}
    ])
    await commentAuthor.save()
    return res.status(201).json(populatedPost)
})



module.exports = router