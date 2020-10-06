const fs = require('fs') // FileSystem
const data = require('./data.json')
const { age, graduation, date } = require('./utils')
const Intl = require('intl')

//show
exports.show = function(req, res){
    //req.params
    const { id } = req.params

    const foundTeachers = data.teachers.find(function(teachers){
        return teachers.id == id
    })

    if (!foundTeachers) return res.send("Teachers not found!!")
   
    const teachers = {
        ...foundTeachers,
        birth: age(foundTeachers.birth),
        escolaridade: graduation(foundTeachers.escolaridade),        
        learn: foundTeachers.learn.split(","),
        create_at: new Intl.DateTimeFormat("pt-BR").format(foundTeachers.create_at)
    }
    
    return res.render("teachers/show", { teachers })
}
// create
exports.post = function (req, res) {

    // Validate
    const keys = Object.keys(req.body) 

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields!!')
        }
    }

    let { avatar_url, birth, name, escolaridade, type_learn, learn, gender } = req.body

    birth = Date.parse(birth)
    const create_at = Date.now()
    const id = Number(data.teachers.length + 1)

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        escolaridade,
        type_learn,
        learn,
        create_at
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send('Write file error!')

        return res.redirect('/teachers')
    })

}
// update
exports.edit = function(req, res) {
    //req.params
    const { id } = req.params

    const foundTeachers = data.teachers.find(function(teachers){
        return teachers.id == id
    })

    if (!foundTeachers) return res.send("Teachers not found!!")

    const teachers = {
        ...foundTeachers,
        birth: date(foundTeachers.birth)
    }
    //Logo abaixo vou enviar o dados após o edit um objeto
    return res.render('teachers/edit', { teachers })
}
// delete