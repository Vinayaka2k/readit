const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')
const {SECRET} = require('../utils/config')

router.post('/', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username})
    if(!user)
        return res.status(400).send({message :'No account with this username has beenn registered'})
    const credentialsValid = await bcrypt.compare(password, user.passwordHash)
    if(!credentialsValid)
        return res.status(401).send({message: 'Invalid username or password'})
    const payloadForToken = {
        id: user._id
    }
    const token = jwt.sign(payloadForToken, SECRET)
    res.status(200).send({token, username: user.username})
})

module.exports = router