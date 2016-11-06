'use strict'

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const dbConfig = require('../../keys')
var options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
}

const connect = (cb) => {
  mongoose.connect('mongodb://' + dbConfig.DBUSER + ':' + dbConfig.DBPASSWORD + '@' + dbConfig.DBURL + '/' + dbConfig.DBNAME, options, cb)
}

const disconnect = (cb) => {
  mongoose.disconnect(cb)
}

module.exports = {
  connect: connect,
  disconnect: disconnect
}
