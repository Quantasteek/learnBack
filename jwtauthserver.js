const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());    

const refreshTokens = [];// not a good idea to store refresh tokens in memory, use a database in production

require('dotenv').config();

app.post('/token', (req, res)=> {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(refreshTokens.includes(refreshToken) ) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({username: user.username})// just username coz user object contains data like issuedAt, iat, exp, etc.  ;
        res.json({accessToken: accessToken});
    })
    
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);    
    res.sendStatus(204); 
})

app.listen(4000, () => {     
    console.log('Server is running on port 4000');
}                       
);

app.post('/login', (req,res) => {
    const username = req.body.username;
    const user = {username: username};
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({accessToken: accessToken, refreshToken: refreshToken});   
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '15s'});
}

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