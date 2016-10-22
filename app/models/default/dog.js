'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DogSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Dog', DogSchema)
