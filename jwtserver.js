const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());    


require('dotenv').config();


app.listen(3000, () => {     
    console.log('Server is running on port 3000');
}                       
);

const posts=[
    {username: 'Surya', title: 'Post One', content: 'This is the content of post one'},
    {username: 'Jim', title: 'Post One', content: 'This is the content of post one'},
    {username: 'Surya', title: 'Post One', content: 'This is the content of post one'},
];

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post=>post.username===req.user.username));        
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];  
    const token = authHeader && authHeader.split(' ')[1]; 
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
    

}