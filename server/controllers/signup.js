const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const {SECRET} = require('../utils/config')
const { response } = require('express')

router.post('/', async (req, res) => {
    const {username, password} = req.body
    if(!password || password.length < 6)
        return res.status(400).send({message:'Password needs to be atleast 6 characters long'})
    if(!username || username.length > 20 || username.length < 3)
        return res.status(400).send({message:'Username length must be in the range of 3 to 20'})

    const existingUser = await User.findOne({username})
    if(existingUser)
        return res.status(400).send({message:'This username already exists'})
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
        username,
        passwordHash
    })
    const savedUser = await user.save()
    const payloadForToken = {
        id: savedUser._id
    }
    const token = jwt.sign(payloadForToken, SECRET)
    res.status(200).send({token, username: savedUser.username})
})

module.exports = router