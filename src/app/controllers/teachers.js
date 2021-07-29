const { age, graduation, date } = require('../../lib/utils')
const Teacher = require('../../app/models/Teacher')

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
            callback(teachers) {

                const pagination = {
                    total: Math.ceil(teachers[0].total / limit),
                    page
                }
                return res.render('teachers/index', { teachers, pagination, filter });
            }
        }

        Teacher.paginate(params)
        

    },
    create(req, res) {
        return res.render('teachers/create')
    },
    post(req, res) {
        const keys = Object.keys(req.body) 

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!!')
            }
        }
    
        Teacher.create(req.body, function(teacher) {
            return res.redirect(`/teachers/${teacher.id}`)
        })

    },
    show(req, res) {
        Teacher.find(req.params.id, function(teachers) {
            if (!teachers) throw `Teacher not found !!!`;

            teachers.birth_date = age(teachers.birth_date);
            teachers.subjects_taught = teachers.subjects_taught.split(',')
            teachers.created_at = date(teachers.created_at).format

            return res.render("teachers/show", { teachers })
        })
    },
    edit(req, res) {
        Teacher.find(req.params.id, function(teachers) {
            if (!teachers) throw `Teacher not found !!!`;

            teachers.birth_date = date(teachers.birth_date).iso;

            return res.render("teachers/edit", { teachers })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body) 

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!!')
            }
        }
        
        Teacher.update(req.body, function() {
            return res.redirect(`/teachers/${req.body.id}`)
        })
    },
    delete(req, res) {
        Teacher.delete(req.body.id, function() {
            return res.redirect(`/teachers`)
        })
    },
}