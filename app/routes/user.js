'use strict'

const express = require('express')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.createConnection('mongodb://' + process.env.DBUSER + ':' + process.env.DBPASSWORD + '@' + process.env.DBURL)
const User = require('../models/custom/user')
let modelAttributes = Object.keys(User.schema.paths).filter(key => key !== '__v' && key !== '_id')

module.exports = (router) => {
	router.route('/user')
		// .post((req, res) => {
		// 	let instance = new User()
		// 	modelAttributes.forEach((key) => {
		// 		instance[key] = req.body[key] ? req.body[key] : instance[key] 
		// 	})
		// 	return instance.save()
		// 		.then(response => res.json({ message: 'User was created successfully' }))
		// 		.catch(error => res.status(403).send(error))
		// })
		.get((req, res) => {
			console.log(User.find)
			res.send(User)
			// return User.find()
			// 	.then(response => res.json(response))
			// 	.catch(error => res.status(500).send(error))
		})
	return router
}