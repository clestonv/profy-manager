const db = require('../../config/db')
const { age, graduation, date } = require('../../lib/utils')

module.exports = {
    all(callback) {
        db.query(`
        SELECT * 
        FROM students 
        ORDER BY name ASC`, function(err, results) {
            if(err) throw `Database Error!! - ${err}`

            callback(results.rows)
        })
        
    },
    create( data, callback ) {
        const query = `
            INSERT INTO students (
                avatar_url,
                name,
                email,
                birth_date,
                gender,
                year_learn,
                class_type,
                count_hours,
                created_at,
                teacher_id
            ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )
            RETURNING id
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth_date).iso,
            data.gender,
            data.year_learn,
            data.class_type,
            data.count_hours,
            date(Date.now()).iso,
            data.teacher
        ]
                
        db.query(query, values, function(err, results) {
            if(err) throw `Database Error!! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
            SELECT students.*, teachers.name AS teacher_name            
            FROM students 
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id = $1`, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0]);
        })
    },
    update(data, callback) {
        const query = `
        UPDATE students SET
            avatar_url=($1),
            name=($2),
            email=($3),
            birth_date=($4),
            gender=($5),
            year_learn=($6),
            class_type=($7),
            count_hours=($8),
            teacher_id =($9)
        WHERE id =($10)           
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            data.birth_date,
            data.gender,
            data.year_learn,
            data.class_type,
            data.count_hours,
            data.teacher,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error!!! ${err}`
            console.log(results)
            callback()
        })
    },
    delete(id, callback) {
        db.query(`
            DELETE FROM students
            WHERE id =$1 `, [id], 
            function(err, results) {
                if (err) throw `Database Error! ${err}`

            return callback()
        })
    },
    teachersSelectOptions(callback) {
        db.query(`SELECT name, id FROM teachers`, function(err, results) {
            if (err) throw 'Database Error!!'

            callback(results.rows)
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM students
            ) AS total`

        if ( filter ) {
            filterQuery = `${query}
            WHERE students.name ILIKE '%${filter}%'
            OR students.email ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM students
                ${filterQuery}
            ) as total`
        }

        query = `SELECT students.*, ${totalQuery}
        FROM students
        ${filterQuery}
        LIMIT $1 OFFSET $2`

        db.query(query, [limit, offset], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows);
        })
    }
}