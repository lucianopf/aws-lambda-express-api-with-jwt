'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BearSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Bear', BearSchema)
