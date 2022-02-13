const router = require('express').Router()
const Post = require('../models/post')

router.get('/', async (req, res) => {
    res.status(200).send('working')
})

module.exports = router