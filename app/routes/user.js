'use strict'

const User = require('../models/custom/user')
let modelAttributes = Object.keys(User.schema.paths).filter(key => key !== '__v' && key !== '_id')
const jwt = require('jsonwebtoken')


module.exports = (router) => {
  router.route('/singup')
    .post((req, res) => {
      let instance = new User()
      modelAttributes.forEach((key) => {
        instance[key] = req.body[key] ? req.body[key] : instance[key]
      })
      return instance.save()
        .then(response => res.json({
          message: 'User was created successfully',
          token: jwt.sign(response, require('../../config').SECRET, {})
        }))
        .catch(error => res.status(403).send(error))
    })
  router.route('/login')
    .post((req, res) => {
      return User.findOne({ username: req.body.username })
        .then((user) => {
          if (!user) {
            throw new Error('User not found in database.')
          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err || !isMatch) {
              res.status(403).send('Wrong password for the provided user.')
            }
            return res.json({
              success: true,
              message: 'Enjoy your token!',
              token: jwt.sign(user, require('../../config').SECRET, {})
            })
          })
        })
        .catch((err) => {
          res.status(403).send(err.message)
        })
    })
  return router
}
