const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const { auth } = require('../utils/middleware');
const numOfComments = require('../utils/numOfComments')

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
    post.commentCount = numOfComments(post.comments)
    const savedPost = await post.save()
    const addedComment = savedPost.comments[savedPost.comments.length - 1];
    res.status(201).json(addedComment);
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
    post.commentCount = numberOfComments(post.comments)
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
    await post.save()
    res.status(202).json(targetComment)
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
        repliedBy: user._id,
        upvotedBy: [user._id],
        pointsCount : 1
    })

    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    post.commentCount = numberOfComments(post.comments)
    //user.karmaPoints.commentKarma = user.karmaPoints.commentKarma + 1

    await post.save()
    const addedReply = targetComment.replies[targetComment.replies.length-1]
    res.status(201).json(addedReply)
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
    
    post.commentCount = numberOfComments(post.comments)
    
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
    targetReply.updatedAt = Date.now

    targetComment.replies = targetComment.replies.map(r => r._id.toString() !== req.params.replyId ? r : targetReply)
    post.comments = post.comments.map( c => c._id.toString() !== req.params.commentId ? c : targetComment)
    await post.save()
    
    res.status(202).json(targetReply)
})

module.exports = router