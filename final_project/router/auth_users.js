const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let filtered_users = users.filter((user)=> user.username === user);
    if(filtered_users){
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if(isValid(username)){
        let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
        if(filtered_users){
            return true;
        }
        return false;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let user = req.body.username;
    let pass = req.body.password;
    if(!authenticatedUser(user,pass)){
        return res.status(403).json({message:"User not authenticated"})
    }

    let accessToken = jwt.sign({
        data: user
    },'access',{expiresIn:60*60})
    req.session.authorization = {
        accessToken
    }
    res.send("User logged in Successfully")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let userd = req.session.username;
  let ISBN = req.params.isbn;
  let details = req.query.review;
  books[ISBN].reviews[userd] = details;
  return res.status(201).json({message:"Review added successfully"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.username;
  let isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review by this user to delete" });
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
