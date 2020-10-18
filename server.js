const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const routes = require('./routes')
const server = express()
const PORT = process.env.PORT || 5000

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(PORT, function() {
    console.log('Server is run!!!')
})