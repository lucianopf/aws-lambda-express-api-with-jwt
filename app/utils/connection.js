'use strict'

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const dbConfig = require('../../config.js')
mongoose.connect('mongodb://' + dbConfig.DBUSER + ':' + dbConfig.DBPASSWORD + '@' + dbConfig.DBURL + '/' + dbConfig.DBNAME)

module.exports = mongoose
