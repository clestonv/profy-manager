const express = require('express')
const routes = express.Router()
const teachers = require('./teachers')

routes.get('/', function(req, res) {
    return res.redirect('/teachers')
})

routes.get('/teachers', function(req, res) {
    return res.render('teachers/index')
})
//create
routes.get('/teachers/create', function (req, res) {
    return res.render('teachers/create')
})
//show
routes.get('/teachers/:id', teachers.show )

//edit
routes.get('/teachers/:id/edit', teachers.edit )

routes.post("/teachers", teachers.post )

routes.get('/students', function(req, res) {
    return res.send('Students')
})

module.exports = routes
