const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');


const app = express()
const port = 3003

app.use(bodyParser.json());

app.post('/api/generate-token', (req, res) => {
    const { issuer, subject, audience, expiration, notBefore, customClaims,secret } = req.body;

    const playload = {
        iss: issuer,
        sub: subject,
        aud: audience,
        exp: Math.floor(Date.now() / 1000).getTime + parseInt(expiration),
        nbf: Math.floor(Date.now() / 1000).getTime + parseInt(notBefore),
        iat: Math.floor(Date.now() / 1000)
    };

    // add custom claims in payload
    if (customClaims && Array.isArray(customClaims)){
        customClaims.forEach(claim => {     
            if (claim.type && claim.value){
                playload[claim.type] = claim.value;
            }
        });
    }


    try {
        const token256 = jwt.sign(playload, secret, { algorithm: 'HS256' });
        const token384 = jwt.sign(playload, secret, { algorithm: 'HS384' });
        const token512 = jwt.sign(playload, secret, { algorithm: 'HS512' });
        res.json({
            token256,
            token384,
            token512,
            
        });
    } catch (error) {
        res.status(500).json({ error: 'Error gennerating token' });
    }


   

});

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))