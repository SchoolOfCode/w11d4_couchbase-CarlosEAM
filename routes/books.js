import express from "express";
const router = express.Router();

import {
  getBooks,
  getBookById,
  searchBooksByTitle,
  searchBooksByAuthor,
  createBook,
  updateBookById,
  deleteBookById,
} from '../repository/bookRepository.js';

/* books endpoints go here */
router.get("/", async function (req, res) {
  // request book by Title
  if (req.query.search !== undefined) {
    const result = await searchBooksByTitle(req.query.search);
    return res.json({ success: true, payload: result });
  }

  // request book by author name
  if (req.query.author !== undefined) {
    const result = await searchBooksByAuthor(req.query.author);
    return res.json({ success: true, payload: result });
  }

  // return all books
  const result = await getBooks();
  res.json({ success: true, payload: result });
});

// request book by its ID
router.get("/:id", async function (req, res) {
  const id = Number(req.params.id);
  const book = await getBookById(id);
  res.json({ success: true, payload: book });
});

// create a new book in the collection
router.post("/", async function (req, res) {
  const newBook = req.body;
  const result = await createBook(newBook);
  res.json({ success: true, payload: result });
});

// update any book in the collection by its id
router.put("/:id", async function (req, res) {
  const id = Number(req.params.id);
  const data = req.body;
  const result = await updateBookById(id, data);
  res.json({ success: true, payload: result });
});

// delete book in the collection by its id
router.delete("/:id", async function (req, res) {
  const id = Number(req.params.id);
  const result = await deleteBookById(id);
  res.json({ success: true, payload: result });
});

export default router;
