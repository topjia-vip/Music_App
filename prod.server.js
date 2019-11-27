var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = 8081

var app = express()

var apiRoutes = express.Router()

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
