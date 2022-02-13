const router = require('express').Router()
const User = require('../models/user')
const Subreddit = require('../models/subreddit')
const {auth} = require('../utils/middleware')

router.get('/', async (req, res) => {
    const allSubreddits = await Subreddit.find({})
    res.json(allSubreddits)
})

router.get('/:id', async (req, res) => {
    const subreddit = await Subreddit.findById(req.params.id)
    res.json(subreddit)
})

router.post('/', auth, async (req, res) => {
    const {subredditName, description} = req.body
    const admin = await User.findById(req.user)
    if(!admin)
        return res.status(404).send({message:'User doesnot exist in Database'})
    const existingSubName = await Subreddit.findOne({subredditName})
    if(existingSubName)
        return res.status(403).send({message:`Subreddit having same name ${subredditName} already exists. Please choose another name`})
    const newSubreddit = new Subreddit({
        subredditName,
        description,
        admin: admin._id,
        subscribedBy: [admin._id],
        subscriberCount: 1
    })
    const savedSubreddit = await newSubreddit.save()
    admin.subscribedSubs = admin.subscribedSubs.concat(savedSubreddit._id)
    await admin.save()
    return res.status(201).json(savedSubreddit)
})

router.patch(':/id', auth, async (req, res) => {
    const { subredditName, description } = req.body
    const admin = await User.findById(req.user)
    const subreddit = await Subreddit.findById(req.params.id)
    if(!admin)
        return res.status(404).send({message: 'User doesnt exist in database'})
    if(!subreddit)
        return res.status(404).send({message:`Subreddit with id ${req.params.id} doesnot exists in Database`})
    if(subreddit.admin.toString() != admin._id.toString())
        return res.status(401).send({message : 'Access is denied!'})
    if(subredditName)
        subreddit.subredditName = subredditName
    if(description)
        subreddit.description = description
    await subreddit.save()
    res.status(202).json(subreddit)
})

module.exports = router