'use strict'

const express = require('express')
let router = express.Router()
var jwt = require('jsonwebtoken')

// SYSTEM MIDDLEWARES
const JWTAuth = (req, res, next) => {
  var authorizationToken = req.headers['authorization']
  if (authorizationToken) {
    let tokens = authorizationToken.split(' ')
    jwt.verify(tokens[1], require('../../config').SECRET, (err, decoded) => {
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

router.get('/', JWTAuth, (req, res) => {
  console.log(req.decoded)
  return res.json({ message: 'Welcome to our api!' })
})

// CUSTOM ROUTES
let Routes = require('require-dir')('./')
Object.keys(Routes).forEach((routeKey) => {
  let actualRoute = Routes[routeKey]
  Object.keys(actualRoute).forEach(routeUrl => {
    Object.keys(actualRoute[routeUrl]).forEach(routeMethod => {
      router.route(routeUrl)[routeMethod](actualRoute[routeUrl][routeMethod])
    })
  })
})

// DEFAULT ROUTES
const Models = require('require-dir')('../models/default')
Object.keys(Models).forEach(modelKey => {
  let Model = Models[modelKey]
  let modelName = Model.modelName
  let instanceName = modelName.toLowerCase()
  let modelAttributes = Object.keys(Model.schema.paths).filter(key => key !== '__v' && key !== '_id')

  router.route('/' + instanceName)
    .post((req, res) => {
      let instance = new Model()
      modelAttributes.forEach((key) => {
        instance[key] = req.body[key] ? req.body[key] : instance[key]
      })
      return instance.save()
        .then(response => res.json({ message: modelName + ' was created successfully' }))
        .catch(error => res.status(403).send(error))
    })
    .get((req, res) => {
      return Model.find()
        .then(response => res.json(response))
        .catch(error => res.status(500).send(error))
    })

  router.route('/' + instanceName + '/:id')
    .get((req, res) => {
      return Model.findById(req.params.id)
        .then(response => res.json(response))
        .catch(error => res.status(500).send(error))
    })
    .put((req, res) => {
      return Model.findById(req.params.id)
        .then(response => {
          response.name = req.body.name
          return response.save()
        })
        .then(response => res.json(response))
        .catch(error => res.status(403).send(error))
    })
    .delete((req, res) => {
      return Model.remove({ _id: req.params.id})
        .then(response => res.json({ message: modelName + ' successfully deleted' }))
        .catch(error => res.status(403).send(error))
    })
})

module.exports = router
