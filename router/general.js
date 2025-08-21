const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//For async operations
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check if both username and password are provided
  if (username && password){
    // Check if the user does not already exist
    if(!isValid(username)){
        // Add the new user to the users array
        users.push(
            {
                "username": username, 
                "password": password
            }
        );
        return res.status(200).json({ messsage: "User succesfully registered. Now you can login"});
    }else{
        return res.status(404).json({ message: "User already exists!"});
    }
  }
  //Return error if username or password is missing
  else{
    return res.status(404).json({ message: "Unable to register user"});
  }
});


// POST route to get the list of books using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Simulate async fetch using Axios (replace with real API if needed)


    // Simulate async behavior with local data
    const response = await new Promise((resolve) => {
      setTimeout(() => resolve({ data: books }), 100); // Simulated delay
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});



// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      // Simulate async fetch using a Promise (you could replace this with a real Axios call to an API)
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const book = Object.values(books).find(b => b.isbn === isbn);
          resolve({ data: book });
        }, 100); // Simulated delay
      });
  
      if (response.data) {
        res.status(200).json(response.data);
      } else {
        res.status(404).json({ message: "Book not found with ISBN: " + isbn });
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving book", error: error.message });
    }
  });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const book = Object.values(books).find(b => b.author === authorName); // Retrieve book object associated with author

  if (book){
    res.status(200).json(book);
  }else{
    res.status(404).json({ message : "Book not found with Author: " + authorName});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
    const book = Object.values(books).find(b => b.title === titleName); // Retrieve book object associated with author
  
    if (book){
      res.status(200).json(book);
    }else{
      res.status(404).json({ message : "Book not found with title: " + titleName});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn); //Find book by ISBN

  if (book){
    res.status(200).json(book.reviews);

  }else{
    res.status(404).json({ message: "book not found with ISBN: " + isbn});
  }
});

module.exports.general = public_users;
