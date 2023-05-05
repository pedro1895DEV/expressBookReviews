const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

regd_users.use(express.json());

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if username is present in records.
const user = users.find(user => user.username === username);
if(user){
  return true;
}
if(!user){
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username);
if(user && user.password === password){
  return true;
}
if(!user || user.password !== password){
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 * 1000 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { rating, review } = req.body;

  if (!rating || !review) {
    return res.status(400).json({ error: "Rating and review are required" });
  }

  const newReview = { rating, review };

  book.reviews.push(newReview);

  return res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviewIndex = book.reviews.findIndex(review => review.username === req.user.username);
    if (reviewIndex === -1) {
      return res.status(404).json({ error: "Review not found" });
    } else {
      book.reviews.splice(reviewIndex, 1);
      return res.status(200).json({ message: "Review deleted successfully" });
    }
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
