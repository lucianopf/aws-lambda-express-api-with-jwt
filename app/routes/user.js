'use strict'

const User = require('../models/custom/user')
let modelAttributes = Object.keys(User.schema.paths).filter(key => key !== '__v' && key !== '_id')

module.exports = {
  '/user': {
    'get': (req, res) => {
      res.send(User)
    }
  }
}
