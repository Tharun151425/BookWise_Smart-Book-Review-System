const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const present = users.filter((user) => user.username === username);
    if (present.length === 0) {
      users.push({ username: username, password: password });
      return res.status(201).json({ message: "User is created successfully!" });
    } else {
      return res.status(400).json({ message: "Username already exists" });
    }
  } else if (!username && !password) {
    return res.status(400).json({ message: "Bad request: username and password are missing" });
  } else {
    return res.status(400).json({ message: "Check username and password" });
  }
});


// Get the book list available in the shop
public_users.get('/', (req, res) => {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
  };

  getBooks()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: "An error occurred" });
    });
  
  // await res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',(req, res) => {
  const ISBN = req.params.isbn;
    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const book = books[ISBN];
            if(book){
              resolve(book);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnIsbn(ISBN).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });
  // await res.send(books[req.params.isbn]); 
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksBasedOnAuthor = (auth) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Convert books object to array
        const filteredbooks = Object.values(books).filter((b) => b.author === auth);
        
        if (filteredbooks.length > 0) {
          resolve(filteredbooks);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });
  };
  booksBasedOnAuthor(author)
    .then((bookList) => {
      res.json(bookList);
    })
    .catch((err) => {
      res.status(404).json({ error: "Book not found" });
    });
  // let filtered_books = [];
  // const name = req.params.author;
  // for (let i in books) {
  //   if (books[i].author === name) {
  //     filtered_books.push(books[i]);
  //   }
  // }
  // await res.send(JSON.stringify(filtered_books,null,4));
});


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  const booksBasedOnTitle = (booktitle) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredbooks = Object.values(books).filter((b) => b.title === booktitle);

        if (filteredbooks.length > 0) {
          resolve(filteredbooks);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });
  };

  booksBasedOnTitle(title)
    .then((new_books) => {
      res.json(new_books);
    })
    .catch((err) => {
      res.status(404).json({ error: "Book not found" });
    });

  // let filtered_books = [];
  // const name = req.params.title;
  // for (let i in books) {
  //   if (books[i].title === name) {
  //     filtered_books.push(books[i]);
  //   }
  // }
  // await res.send(JSON.stringify(filtered_books,null,4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ error: "Book not found or no reviews available" });
  }
});

module.exports.general = public_users;
