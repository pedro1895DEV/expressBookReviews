const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Register a user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  const newUser = { username, password };
  users.push(newUser);

  return res.status(200).json({ message: "User registration successful" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({message: books})
});


/* //Get the book list avalaible in the shop using promisses
public_users.get('/', function(req, res) {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject({ error: "No books available" });
      }
    });
  };


  getBooks()
    .then((books) => {
      res.status(200).json({ message: books });
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});
*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(isbn > 10){
    return res.status(404).json({message: 'Invalid ISBN'})
  }else{
    return res.status(200).json({message: book});
  }
 });

 /*
  // Get book details based on ISBN using promisses
  public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const findBook = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Invalid ISBN'));
    }
  });

  findBook.then(book => {
    return res.status(200).json({ message: book });
  }).catch(error => {
    return res.status(404).json({ message: error.message });
  });
});
 */
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBooks = [];
  for(isbn in books){
    const book = books[isbn];
    if (book.author === author) {
      authorBooks.push(book);
    } 
  }
  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ error: "No books found for author" });
  }
});

/*
// Get book details based on author using promisses
public_users.get('/author/:author', function(req, res) {
  const author = req.params.author;
  const authorBooks = [];
  const promises = [];

  for (isbn in books) {
    const book = books[isbn];
    if (book.author === author) {
      const promise = new Promise((resolve, reject) => {
        resolve(book);
      });
      promises.push(promise);
    }
  }

  Promise.all(promises)
    .then((books) => {
      if (books.length > 0) {
        return res.status(200).json(books);
      } else {
        return res.status(404).json({ error: "No books found for author" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

*/ 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const titleBook = [];
  for(const isbn in books){
    const book = books[isbn];
    if (book.title.toLowerCase().includes(title)) {
      titleBook.push(book);
    }
  }
    if (titleBook.length > 0) {
      return res.status(200).json(titleBook);
    } else {
      return res.status(404).json({ error: "No books found for author title" });
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    const reviews = book.reviews;
    return res.status(200).json({reviews});
  }
  else{
    return res.status(404).json({"error": 'review not found'})
  }
});

module.exports.general = public_users;
