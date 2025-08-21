const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter users array for any user with the same username
    let userswithsamename = users.filter((user)=>{ 
        return user.username === username;
    });
    // Return ture if any user with the same username is found
    if (userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user)=>{ 
        return (user.username === username && user.password ==password);
    });
    //Return true if any valid user is found, otherwise false
    if (validusers.length >0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password){
    return res.status(404).json({ message: "Error logging in"});
  }

  // Authenticate user
  if (authenticatedUser(username, password)){
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access' , { expiresIn: 60 * 60});
    
    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User succesfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password"})
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let retrieved_user = req.session.authorization?.username; //Retrieve the username from the session (assumes user is logged in)
    let ISBN = req.params.isbn; // Extract the ISBN from the URL parameter
    let details = req.query.review; // Extract the review text from the query string
    let bookEntry = Object.values(books).find(book => book.isbn === ISBN);

    //Check if the book with the given ISBN exists in the book object
    if (!bookEntry) { // A book object doesn't exists for a given ISBN key => if it is true
        //If not found, return a 404 error response
        return res.status(404).json({ message: "Book not found"});
    }
    //Initialize the reviews object if it doesn't exist
    if (!bookEntry.reviews){
        bookEntry.reviews = {};
    }
    //Add or update the review for the current user
    // This ensures each user can only have one review per book
    bookEntry.reviews[retrieved_user] = details;

    // Return a success response with status code 201 (created)
    return res.status(201).json({ message: "Review added succesfully"});
    
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
