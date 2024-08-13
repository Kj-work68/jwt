var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secret = "Fullstack-login-2024";
const { checkRole } = require('./middlewares/authMiddleware')

app.use(cors());
app.use(express.json());
const mysql = require("mysql2");
const tokenBlacklist = new Set();

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password@1234",
  database: "curd_jwt"
});

app.post("/register", jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.

    connection.execute(
      "INSERT INTO users (email, password, fname, lname, role) VALUES (?, ?, ?, ?, ?)",
      [req.body.email, hash, req.body.fname, req.body.lname, req.body.role],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } // results contains rows returned by server// fields contains extra meta data about results, if available
        res.json({ status: "ok" });
      }
    );
  });
  // execute will internally call prepare and query
});

app.post("/login", jsonParser, function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE email=?",
    [req.body.email],
    function (err, users, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } // results contains rows returned by server// fields contains extra meta data about results, if available
      if (users.length == 0) {
        res.json({
          status: "error",
          message: "no user found",
        });
        return;
      }
      bcrypt.compare(
        req.body.password,
        users[0].password,
        function (err, isLogin) {
          // result == true
          if (isLogin) {
            var token = jwt.sign({email: users[0].email, role: users[0].role}, secret, {expiresIn: '1d'})
            res.json({ status: "ok", message: "Login success", token });
          } else {
            res.json({ status: "error", message: "Cannot Success" });
          }
        }
      );
    }
  );
});


app.post("/authen", jsonParser, function (req, res, next) {
  try{
  const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, secret);
    res.json({status: 'ok', decoded})
  }catch(err){
    res.json({status: 'Error', message: err.message})
  }
  

})

app.delete("/logout", jsonParser, function(req, res, ){
  const token = req.headers.authorization.split(' ')[1];
  // Add token to blacklist
  tokenBlacklist.add(token);
  res.json({ status: "ok", message: "Logged out successfully" });
});



app.get("/admin", checkRole('admin'), function (req, res) {
  res.json({ status: 'ok', message: 'Welcome Admin' });
});

app.get("/user", checkRole('user'), function (req, res) {
  res.json({ status: 'ok', message: 'Welcome User' });
});

// //Genertae JWT TOKEN
// app.post('/generate', (req, res)=>{
//   try{
//     const { email, password, role } = req.body;

//     //check if email, password, role
//     if (!email || !password || !role){
//       return res.status(400).send('Usename and role are required')
//     }
//     const acctoken = jwt.sign({ email }, secret, { expiresIn: '120s' });
//     const rftoken = jwt.sign({ email }, secret,{ expiresIn: '5m' })
//     res.json({ acctoken, rftoken })
//    }catch(error){
//     console.error('Error generate:', error);
//     res.status(500).send('Internal Server Error')
//    }
// });


app.post('/api/generate-token', (req, res) => {
    const { issuer, subject, audience, expiration, notBefore, customClaims, secret } = req.body;

    const playload = {
        iss: issuer,
        sub: subject,
        aud: audience,
        exp: Math.floor(Date.now() / 60) + parseInt(expiration),
        nbf: Math.floor(Date.now() / 60) + parseInt(notBefore),
        iat: Math.floor(Date.now() / 60)
    };

    // add custom claims in payload
    if (customClaims && Array.isArray(customClaims)){
        customClaims.forEach(claim => {     
            if (claim.type && claim.value){
                playload[claim.type] = claim.value;
            }
        });
    }

    //add Signed JSON Web Token 

   

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


// get data (SERVICE) .json เขียนไงวะ?

app.get('/intel', (req, res, next)=>{
  const query = "SELECT * FROM information WHERE id = ?"
  connection.execute(query, (err, results, fields)=>{
    if(err){
      console.log(err)
    }
    res.json(results);
  })
});



app.listen(3003, function () {
  console.log("CORS-enabled web server listening on port 3003");
});
