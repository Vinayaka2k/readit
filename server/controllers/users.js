const router = require('express').Router()
const User = require('../models/user')

router.get('/:id', async (req, res) => {
    const user = User.findById(req.params.id)
    res.json(user)
})

module.exports = router