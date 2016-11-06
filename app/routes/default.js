'use strict'

const express = require('express')
let router = express.Router()
const jwt = require('jsonwebtoken')
const mongoose = require('../utils/connection')

// SYSTEM MIDDLEWARES
const JWTAuth = (req, res, next) => {
  const authorizationToken = req.headers['authorization']
  if (authorizationToken) {
    let tokens = authorizationToken.split(' ')
    jwt.verify(tokens[1], require('../../keys').SECRET, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        req.decoded = decoded._doc
        next()
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
}
const mongooseConnect = (req, res, next) => {
  console.log('Connecting...')
  mongoose.connect(next)
}
const mongooseDisconnect = (req, res) => {
  console.log('Disconnecting...')
  mongoose.disconnect()
}

router.use(mongooseConnect)
router.get('/', (req, res) => res.json({ message: 'Welcome to our api!' }))

// CUSTOM ROUTES
router = require('./user.js')(router)

// DEFAULT ROUTES
const Models = require('require-dir')('../models/default')
Object.keys(Models).forEach(modelKey => {
  let Model = Models[modelKey]
  let modelName = Model.modelName
  let instanceName = modelName.toLowerCase()
  let modelAttributes = Object.keys(Model.schema.paths).filter(key => key !== '__v' && key !== '_id')

  router.route('/' + instanceName)
    .post(JWTAuth, (req, res, next) => {
      let instance = new Model()
      modelAttributes.forEach((key) => {
        instance[key] = req.body[key] ? req.body[key] : instance[key]
      })
      return instance.save()
        .then(response => {
          res.json({ message: modelName + ' was created successfully' })
          next()
        })
        .catch(error => res.status(403).send(error))
    })
    .get(JWTAuth, (req, res, next) => {
      console.log('Getting this ' + instanceName)
      return Model.find()
        .then(response => {
          res.json(response)
          next()
        })
        .catch(error => res.status(500).send(error))
    })

  router.route('/' + instanceName + '/:id')
    .get(JWTAuth, (req, res) => {
      return Model.findById(req.params.id)
        .then(response => res.json(response))
        .catch(error => res.status(500).send(error))
    })
    .put(JWTAuth, (req, res) => {
      return Model.findById(req.params.id)
        .then(response => {
          response.name = req.body.name
          return response.save()
        })
        .then(response => res.json(response))
        .catch(error => res.status(403).send(error))
    })
    .delete(JWTAuth, (req, res) => {
      return Model.remove({ _id: req.params.id })
        .then(response => res.json({ message: modelName + ' successfully deleted' }))
        .catch(error => res.status(403).send(error))
    })
})

router.use(mongooseDisconnect)

module.exports = router
