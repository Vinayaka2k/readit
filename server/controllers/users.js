const router = require('express').Router()
const User = require('../models/user')

router.get('/:id', async (req, res) => {
    const user = User.findById(req.params.id)
        .populate({
            path: 'posts',
            select: '-upvotedBy -downvotedBy',
            populate: {
                path: 'subreddit',
                select: 'subredditName'
            }
        })
})

module.exports = router