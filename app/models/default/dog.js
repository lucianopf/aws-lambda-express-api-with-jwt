'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let DogSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Dog', DogSchema)
