/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response } from "express";
import path from 'path';
import { writeFile, readFile } from 'fs/promises';

/*-----------------------------------Custom Interfaces/Properties/ Functions-------------------------------------*/
interface Book {
  id: number;
  title: string;
  author: string;
  createdAt:string;
  updatedAt:string;
}

let books: Book[];

const dataFolderPath = path.join(__dirname, '..', 'data', 'books.json');

/*-----------------------------------------routes------------------------------------*/
const bookRoutes = Router();

// Get all books
bookRoutes.get("/books", async (req: Request, res: Response) => {
  try {
    const data = await readFile(dataFolderPath, 'utf8');
    const books = JSON.parse(data);
    res.json(books);
  } catch (error) {
    console.error(error);
    // Send a 500 Internal Server Error response
    res.status(500).send("An error occurred while reading the data.");
  }
});

// Get a book by ID
bookRoutes.get("/books/:id", async (req: Request, res: Response) => {
  try {
    // Await the asynchronous operation
    const data = await readFile(dataFolderPath, 'utf8');
    const books = JSON.parse(data);

    // This code now runs only after the file has been read
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

// Create a new book
bookRoutes.post("/books", async (req: Request, res: Response) => {
  try {
    // 1. Await the readFile operation
    const data = await readFile(dataFolderPath, 'utf8');
    const books = JSON.parse(data);

    // 2. Create the new book object
    const newBook = {
      id: books.length + 1,
      title: req.body.title,
      author: req.body.author,
      createdAt: new Date().toISOString(),
      updatedAt: ""
    };

    // 3. Add the new book to the array
    books.push(newBook);

    // 4. Await the writeFile operation
    await writeFile(dataFolderPath, JSON.stringify(books, null, 2));

    // 5. Send the final response
    res.status(201).json(newBook);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

//Update a book by ID
bookRoutes.put("/books/:id", async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);

    // Await the asynchronous readFile operation
    const data = await readFile(dataFolderPath, 'utf8');
    const books = JSON.parse(data);

    // Find the book's index
    const bookIndex = books.findIndex(b => b.id === bookId);

    // If the book exists, update it
    if (bookIndex !== -1) {
      const updatedBook = {
        id: bookId,
        title: req.body.title,
        author: req.body.author,
        createdAt: books[bookIndex].createdAt, // Preserve original creation date
        updatedAt: new Date().toISOString()
      };
      
      books[bookIndex] = updatedBook;

      // Await the asynchronous writeFile operation
      await writeFile(dataFolderPath, JSON.stringify(books, null, 2));

      // Send the response after the file has been successfully written
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

// Delete a book by ID
bookRoutes.delete("/books/:id", async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);

    // 1. Await the readFile operation to get the current books
    const data = await readFile(dataFolderPath, 'utf8');
    const books = JSON.parse(data);

    // 2. Find the index of the book to be deleted
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
      // 3. Remove the book from the array
      const deletedBook = books.splice(bookIndex, 1)[0]; 
      
      // 4. Await the writeFile operation to save the changes
      await writeFile(dataFolderPath, JSON.stringify(books, null, 2));

      // 5. Send a success response after the file is written
      res.status(200).json({ message: "Book deleted successfully", deletedBook });

    } else {
      // If the book was not found, send a 404 response
      res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

export default bookRoutes;