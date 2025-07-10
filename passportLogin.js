if(process.env.NODE_ENV !== 'production'){
        require('dotenv').config();
    }   

const express = require('express'); 
const bcrypt = require('bcrypt');
const passport = require('passport');
const app = express();
app.use(express.urlencoded({extended: true}));
const flash = require('express-flash'); 
const session = require('express-session');
app.use(flash());   
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //should we resave session vars if nothing is changed
    saveUninitialized: false, //not to store empty sessions
})) 

app.use(passport.initialize());
app.use(passport.session());    

app.set('view engine', 'ejs');  
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const initializePassport = require('./passport-config');
initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)  
);


const users=[]
app.get('/', (req, res) => {
    res.render('index.ejs', {name: 'Bro'});
});
app.get('/register', (req, res) => {
    res.render('register.ejs' );
});
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/register', (req, res) =>{
    try{
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);  
        users.push({
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login')
    }
    catch(err){
        res.redirect('/register')
        console.error(err);
        res.status(500).send('Internal Server ')
    }
    console.log(users); 
});
app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
} ) );