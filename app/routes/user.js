'use strict'

const User = require('../models/custom/user')
let modelAttributes = Object.keys(User.schema.paths).filter(key => key !== '__v' && key !== '_id')

module.exports = {
  '/user': {
    'get': (req, res) => {
      return User.find()
        .then(response => res.json(response))
        .catch(error => res.status(500).send(error))
    }
  }
}
