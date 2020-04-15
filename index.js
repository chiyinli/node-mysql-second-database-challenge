const express = require('express');
const mysql = require('mysql');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride('_method'));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: 'second-database-challenge',
});
db.connect( (error) => {
    if(error) {
        console.log( error );
    } else {
        console.log('MySQL connected');
    }
});
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.set('view engine', 'hbs');
app.get('/', (req, res) => {
    db.query("SELECT * FROM users", (error, result) => {
        if(error) {
            console.log('Error in the query');
        }  else {
           
            res.render('index', {
                data: result
            });
        }
    });
});
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register/user', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    const location = req.body.location;
    const salary = req.body.salary;

    let sql = 'INSERT INTO users SET name = ?, email = ?, password = ?, age = ?, location = ?, salary = ?';
    let user = [ name, email, password, age, location, salary ];
    db.query(sql, user, (error, result) => {
        if(error) {
            console.log(error);
        } else {
            res.send('<h1>User Registered</h1>')
        }
    });
});
    app.put('/edit/:id', (req, res) => {
        console.log(req.params.id);
    
        const name = req.body.editName;
        const id = req.params.id;
        let sql = 'UPDATE FROM users SET name = ? WHERE id = ?';
        let user = [name, id];
    
        db.query(sql, user, (error, result) => {
            if(error){
                console.log('there is some error');
            } else {
                res.send('<h1>User name update</h1>');
            }
        });
    });
    
    app.put('/delete/:id', (req, res) => {
    
        const id = req.params.id;
    
        let sql = 'DELETE FROM users WHERE id = ?';
        let user = [id];
    
        db.query(sql, user, (error, result) => {
            if(error){
                console.log('there is some error');
            } else {
                res.send('<h1>User has been deleted</h1>');
            }
        });
    });
    
    app.listen(5000, () => {
        console.log("server is running on port 5000");
    });