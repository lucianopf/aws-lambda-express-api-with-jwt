'use strict'

const express = require('express')
let router = express.Router()
const mongoose = require('../utils/connection')

// SYSTEM ROUTES
router.use((req, res, next) => {
  console.log('Here goes a logger.')
  next()
})

router.get('/', (req, res) => res.json({ message: 'hooray! welcome to our api!!' }))

// CUSTOM ROUTES
const userRoute = require('./user.js')
Object.keys(userRoute).forEach(routeUrl => {
  Object.keys(userRoute[routeUrl]).forEach(routeMethod => {
    router.route(routeUrl)[routeMethod](userRoute[routeUrl][routeMethod])
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
