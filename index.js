const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

//Middleware to handle sessions
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Middleware to authenticate users using JWT
if (req.session.authorization) { //Get the authorization object stored in the session
    let token = req.session.authorization['accessToken'] //Retrieve the token from authorization object
    
    jwt.verify(token, "access", (err, user) =>{ // Use JWT to verify token
        if (!err){
            req.user = user;
            next(); //Proceed to the next middleware
        }
        else{
            return res.status(403).json({ message: "User not authenticated"})
        }
    })

}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
