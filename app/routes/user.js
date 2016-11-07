'use strict'

const User = require('../models/custom/user')
let modelAttributes = Object.keys(User.schema.paths).filter(key => key !== '__v' && key !== '_id')
const jwt = require('jsonwebtoken')
const config = require('../../keys')
const EXPIRESIN = '4h'

module.exports = (router) => {
  router.route('/singup')
    .post((req, res, next) => {
      let instance = new User()
      modelAttributes.forEach((key) => {
        instance[key] = req.body[key] ? req.body[key] : instance[key]
      })
      return instance.save()
        .then(response => {
          res.json({
            message: 'User was created successfully',
            token: jwt.sign(response, config.SECRET, { expiresIn: EXPIRESIN })
          })
          next()
        })
        .catch(error => {
          res.status(403).send(error)
          next()
        })
    })
  router.route('/login')
    .post((req, res, next) => {
      User.findOne({ username: req.body.username })
        .then((user) => {
          if (!user) {
            throw new Error('User not found in database.')
          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err || !isMatch) {
              res.status(403).send('Wrong password for the provided user.')
            }
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: jwt.sign(user, config.SECRET, { expiresIn: EXPIRESIN })
            })
            next()
          })
        })
        .catch((err) => {
          res.status(403).send(err.message)
          next()
        })
    })
  return router
}
