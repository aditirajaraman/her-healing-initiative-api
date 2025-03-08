import { Router, Request, Response } from "express";
var path = require('path');

const bookRoutes = Router();

interface Book {
  id: number;
  title: string;
  author: string;
  createdAt:string;
  updatedAt:string;
}

let books: Book[];

const { writeFile, readFile } = require('fs');
const dataFolderPath = path.join(__dirname, '..', 'data', 'books.json');

// Get all books
bookRoutes.get("/books", (req: Request, res: Response) => {
  readFile(dataFolderPath, (error:any, data:any) => {
    if (error) {
      console.log(error);
      return;
    }
    books = JSON.parse(data);
    //console.log(parsedData);
    res.json(books);
  });
});

// Get a book by ID
bookRoutes.get("/books/:id", (req: Request, res: Response) => {
  readFile(dataFolderPath, (error:any, data:any) => {
    if (error) {
      //console.log(error);
      return;
    }
    books = JSON.parse(data);
  });
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Create a new book
bookRoutes.post("/books", (req: Request, res: Response) => {
  let newBook:Book;
  readFile(dataFolderPath, (error:any, data:any) => {
    if (error) {
      //console.log(error);
      return;
    }
    books = JSON.parse(data);
    newBook = {
      id: books.length + 1,
      title: req.body.title,
      author: req.body.author,
      createdAt : new Date().toISOString(),
      updatedAt : ""
    };
    books.push(newBook);
    //console.log(books);
    writeFile(dataFolderPath, JSON.stringify(books, null, 2), (err:any) => {
      if (err) {
        //console.log('Failed to write updated data to file');
        return;
      }
      //console.log('Updated file successfully');
    });
    res.status(201).json(newBook);
  });
});

//Update a book by ID
bookRoutes.put("/books/:id", (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);
  readFile(dataFolderPath, (error:any, data:any) => {
    if (error) {
      //console.log(error);
      return;
    }
    books = JSON.parse(data);
    let bookIndex = books.findIndex(b => b.id === bookId);
    const updatedBook = books.find(b => b.id === bookId);
    //console.log(books);
    if (bookIndex !== -1) {
      books[bookIndex] = { 
        id: bookId, 
        title: 
        req.body.title, 
        author: req.body.author, 
        createdAt : updatedBook?updatedBook.createdAt:new Date().toISOString(), 
        updatedAt : new Date().toISOString() 
      };
      //Write jsonStream
      writeFile(dataFolderPath, JSON.stringify(books, null, 2), (err:any) => {
        if (err) {
          //console.log('Failed to write updated data to file');
          return;
        }
        //console.log('Updated file successfully');
      }); 
      res.json(books[bookIndex]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
});

// Delete a book by ID
bookRoutes.delete("/books/:id", (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);
  readFile(dataFolderPath, (error:any, data:any) => {
    if (error) {
      //console.log(error);
      return;
    }
    books = JSON.parse(data);
    //console.log(books);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1); //Remove book
      //Write jsonStream
      writeFile(dataFolderPath, JSON.stringify(books, null, 2), (err:any) => {
        if (err) {
          //console.log('Failed to write updated data to file');
          return;
        }
        //console.log('Updated file successfully');
      }); 
      res.json(books[bookIndex]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
});

export default bookRoutes;