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
        commentAuthor.karmaPoints.commentKarma --
    }
    else{
        targetComment.upvotedBy = targetComment.upvotedBy.concat(user._id)
        targetComment.downvotedBy = targetComment.downvotedBy.filter(d => d.toString() !== user._id.toString())
        commentAuthor.karmaPoints.commentKarma ++
    }
    targetComment.pointsCount = targetComment.upvotedBy.length - targetComment.downvotedBy.length
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    await post.save()
    await commentAuthor.save()
   
    return res.status(201).end()
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
        commentAuthor.karmaPoints.commentKarma ++
    }
    else{
        targetComment.downvotedBy = targetComment.downvotedBy.concat(user._id)
        targetComment.upvotedBy = targetComment.upvotedBy.filter(d => d.toString() !== user._id.toString())
        commentAuthor.karmaPoints.commentKarma --
    }
    targetComment.pointsCount = targetComment.upvotedBy.length - targetComment.downvotedBy.length
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    await post.save()
    await commentAuthor.save()
    
    return res.status(201).end()
})

router.post('/:id/comment/:commentId/reply/replyId/upvote', auth, async (req, res) => {
    const {id, commentId, replyId} = req.params
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
    
    const replyAuthor = await User.findById(targetReply.repliedBy)
    if(!replyAuthor)
        return res.status(404).send({message: 'Reply author doesnt exist in database'})

    if(targetReply.upvotedBy.includes(user._id.toString())){
        targetReply.upvotedBy = targetReply.upvotedBy.filter( u => u.toString() !== user._id.toString())
        replyAuthor.karmaPoints.commentKarma --
    }
    else{
        targetReply.upvotedBy = targetReply.upvotedBy.concat(user._id)
        targetReply.downvotedBy = targetReply.downvotedBy.filter( d => d.toString() !== user._id.toString())
        replyAuthor.karmaPoints.commentKarma ++
    }
    targetReply.pointsCount = targetReply.upvotedBy.length - targetReply.downvotedBy.length
    targetComment.replies = targetComment.replies.map( r => r._id.toString() !== replyId ? r : targetReply)
    post.comments = post.comments.map( c => c._id.toString() !== commentId ? c : targetComment)
    await post.save()
    await replyAuthor.save()
   
    res.status(201).end()
})


router.post('/:id/comment/:commentId/reply/replyId/downvote', auth, async (req, res) => {
    const {id, commentId, replyId} = req.params
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
    
    const replyAuthor = await User.findById(targetReply.repliedBy)
    if(!replyAuthor)
        return res.status(404).send({message: 'Reply author doesnt exist in database'})

    if(targetReply.downvotedBy.includes(user._id.toString())){
        targetReply.downvotedBy = targetReply.downvotedBy.filter( d => d.toString() !== user._id.toString())
        replyAuthor.karmaPoints.commentKarma ++
    }
    else{
        targetReply.downvotedBy = targetReply.downvotedBy.concat(user._id)
        targetReply.upvotedBy = targetReply.upvotedBy.filter( u => u.toString() !== user._id.toString())
        replyAuthor.karmaPoints.commentKarma --
    }
    targetReply.pointsCount = targetReply.upvotedBy.length - targetReply.downvotedBy.length
    targetComment.replies = targetComment.replies.map( r => r._id.toString() !== replyId ? r : targetReply)
    post.comments = post.comments.map( c => c._id.toString() !== commentId ? c : targetComment)
    await post.save()
    await replyAuthor.save()
    
    res.status(201).end()
})

module.exports = router