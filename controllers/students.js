const fs = require('fs') // FileSystem
const data = require('../data.json')
const { age, graduation, date } = require('../utils')
const Intl = require('intl')

//index
exports.index = function(req, res) {
    return res.render('students/index', { students: data.students })
}
//show
exports.show = function(req, res){
    //req.params
    const { id } = req.params

    const foundStudents = data.students.find(function(students){
        return students.id == id
    })

    if (!foundStudents) return res.send("Students not found!!")
   
    const students = {
        ...foundStudents,
        birth: age(foundStudents.birth),
        create_at: new Intl.DateTimeFormat("pt-BR").format(foundStudents.create_at)       
    }
    
    return res.render("students/show", { students })
}
// create
exports.create = function (req, res) {
    return res.render('students/create')
}

exports.post = function (req, res) {

    // Validate
    const keys = Object.keys(req.body) 

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields!!')
        }
    }


    birth = Date.parse(req.body.birth)
    const create_at = Date.now()

    let id = 1;
    const lastId = data.students[data.students.length - 1]

    if (lastId) {
        id = lastId.id + 1
    }

    data.students.push({
        ...req.body,
        id,
        birth,
        create_at
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send('Write file error!')

        return res.redirect('/students')
    })

}
// update
exports.edit = function(req, res) {
    //req.params
    const { id } = req.params

    const foundStudents = data.students.find(function(students){
        return students.id == id
    })

    if (!foundStudents) return res.send("Students not found!!")

    const students = {
        ...foundStudents,
        birth: date(foundStudents.birth).iso
    }
    //Logo abaixo vou enviar o dados após o edit um objeto
    return res.render('students/edit', { students })
}

exports.put = function (req, res) {
    const { id } = req.body

    let index = 0

    const foundStudents = data.students.find(function(students, index){
        return students.id == id
    })

    if (!foundStudents) return res.send("Students not found!!")

    const student = {
        ...foundStudents,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write Error!")

        return res.redirect(`/students/${id}`)
    })
}
// delete
exports.delete = function( req, res ) {
    const { id } = req.body

    const filterStudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filterStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error!!!")

        return res.redirect("/students")
    })

}