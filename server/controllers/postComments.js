const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const { auth } = require('../utils/middleware');

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