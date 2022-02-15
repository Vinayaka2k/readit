const router = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const { auth } = require('../utils/middleware')

router.post('/:id/downvote', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)

    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exits in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const author = await User.findById(post.author);
    if (!author) 
        return res.status(404).send({ message: 'Author user does not exist in database.' })
    
    if(post.downVotedBy.includes(user._id.toString())){
        post.downVotedBy = post.downVotedBy.filter(d => d.toString() !== user._id.toString())
        author.karmaPoints.postKarma++
    }
    else{
        post.downVotedBy = post.downVotedBy.concat(user._id)
        post.upVotedBy = post.upVotedBy.filter(u => u.toString() !== user._id.toString())
        author.karmaPoints.postKarma--
    }
    const calculatedPoints = post.upVotedBy.length - post.downVotedBy.length
    if(calculatedPoints < 0)
        post.pointsCount = 0                // can this be allowed to be negative ?
    else
        post.pointsCount = calculatedPoints
    await post.save()
    await author.save()
    
    const updatedVotes = {
        upvotedBy: post.upvotedBy,
        downvotedBy: post.downvotedBy,
        pointsCount: post.pointsCount,
      }
    
      res.status(201).json(updatedVotes)
})

router.post('/:id/upvote', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user)

    if(!post)
        return res.status(404).send({message: `Post with ${req.params.id} doesnt exits in DB`})
    if(!user)
        return res.status(404).send({message: `User doesnot exits in database`})
    
    const author = await User.findById(post.author);
    if (!author) 
        return res.status(404).send({ message: 'Author user does not exist in database.' })
      
    if(post.upVotedBy.includes(user._id.toString()))  {          // already upvoted
        post.upVotedBy = post.upVotedBy.filter(u => u.toString() !== user._id.toString())
        author.karmaPoints.postKarma--
    }
    else {                                                      // already downvoted OR not voted yet
        post.upVotedBy = post.upVotedBy.concat(user._id)
        post.downVotedBy = post.downVotedBy.filter(d => d.toString() !== user._id.toString())
        author.karmaPoints.postKarma++
    }
    const calculatedPoints = post.upVotedBy.length - post.downVotedBy.length
    if(calculatedPoints < 0)
        post.pointsCount = 0                // can this be allowed to be negative ?
    else
        post.pointsCount = calculatedPoints
    await post.save()
    await author.save()

    const updatedVotes = {
        upvotedBy: post.upvotedBy,
        downvotedBy: post.downvotedBy,
        pointsCount: post.pointsCount,
      }
    
      res.status(201).json(updatedVotes)
})

module.exports = router