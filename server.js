'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var morgan = require('morgan')

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', require('./app/routes/default'))

app.listen(process.env.PORT || 8080)
console.log('Magic is happening!')
