const express = require('express');
const app = express();  
const bcrypt = require('bcrypt');

app.use(express.json());

const users = []
const products_routes= require('./routes/products');
app.get('/users', (req, res) => {
    res.json(users);
});     

app.use("/api/products", products_routes);

app.post('/users', async(req, res) => {
    try{
        const salt= bcrypt.genSaltSync();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user={name: req.body.name, password: hashedPassword, email: req.body.email};
        users.push(user)
        res.status(201).send()

    }catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }   
})
app.post('/users/login', async(req, res) => {
    const user = users.find(u => u.name === req.body.name);
    if(user==null){
        return res.status(400).send('Cannot find user');    
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password))
            res.send('Success');
        else
            res.send('Not Allowed');
    }
    catch{

    }

})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 