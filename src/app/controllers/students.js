const { age, graduation, date } = require('../../lib/utils')
const Student = require('../../app/models/Student')

module.exports = {
    index(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(students) {

                const pagination = {
                    total: Math.ceil(students[0].total / limit),
                    page
                }
                return res.render('students/index', { students, pagination, filter });
            }
        }

        Student.paginate(params)

    },
    create(req, res) {
        Student.teachersSelectOptions(function(options) {
            
            return res.render('students/create', { teacherOptions: options })
        })
        
    },
    post(req, res) {
        const keys = Object.keys(req.body) 

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!!')
            }
        }
    
        Student.create(req.body, function(student) {
            return res.redirect(`/students/${student.id}`)
        })

    },
    show(req, res) {
        Student.find(req.params.id, function(students) {
            if (!students) throw `Student not found !!!`;

            students.birth_date = age(students.birth_date);
            students.created_at = date(students.created_at).format

            return res.render("students/show", { students })
        })
    },
    edit(req, res) {
        Student.find(req.params.id, function(students) {
            if (!students) return res.send("Students Not Found !!!")
            
            students.birth_date = date(students.birth_date).iso;

            Student.teachersSelectOptions(function(options) {                
                return res.render('students/edit', { students, teacherOptions: options })
            })          
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body) 

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!!')
            }
        }
        
        Student.update(req.body, function() {
            return res.redirect(`/students/${req.body.id}`)
        })
    },
    delete(req, res) {
        Student.delete(req.body.id, function() {
            return res.redirect(`/students`)
        })
    },
}