import {couchbaseConnect, getBucket, getCollection} from './cbmanager.js'

// GET: all books in collection
export async function getBooks() {
  try {
    // META().id returns the id of the document
    const query = `SELECT META().id, title, author, description FROM books LIMIT 20`;
    // request
    const cluster = await couchbaseConnect();
    const bucket = getBucket(cluster);
    const scope = bucket.defaultScope();
    // use custom query
    const results = await scope.query(query);
    return results.rows;
  }catch(error) {
    console.error(error);
  }
}

// GET: book in collection by its id
export async function getBookById(key) {
  // the returned object doesn't have the document id
  try {
    const cluster = await couchbaseConnect();
    const bucket = getBucket(cluster);
    const scope = bucket.defaultScope();
    const collection = getCollection(scope);
    const results = await collection.get(key);
    return results.content;
  }catch(error) {
    console.error(error);
  }
}

// GET: book in collection by its title
export async function searchBooksByTitle(bookTitle) {
  try {
    // custom query, looks for book titles to match any part of the params
    // turning all search string to lowercase
    var query = `
      SELECT META().id, * 
      FROM books 
      WHERE LOWER(title) 
      LIKE '%'||LOWER($BOOKTITLE)||'%';`;
    const options = { parameters: { BOOKTITLE: bookTitle } }
    const cluster = await couchbaseConnect();
    const bucket = getBucket(cluster);
    const scope = bucket.defaultScope();
    // use custom query
    const results = await scope.query(query, options);
    // create and return book array as per docs
    return results.rows.map(book => {return {...book.books, id: book.id}})
  }catch(error) {
    console.error(error);
  }
}

// GET: book in collection by author name
export async function searchBooksByAuthor(author) {
  try {
    // custom query, looks for book author which matches any part of the params
    // all search strings turned to lowercase
    var query = `
      SELECT META().id, * 
      FROM books 
      WHERE LOWER(author) 
      LIKE '%'||LOWER($AUTHORNAME)||'%';`;
    const options = { parameters: { AUTHORNAME: author } }
    const cluster = await couchbaseConnect();
    const bucket = getBucket(cluster);
    const scope = bucket.defaultScope();
    // use custom query
    const results = await scope.query(query, options);
    // create and return book array as per docs
    return results.rows.map(book => {return {...book.books, id: book.id}})
  }catch(error) {
    console.error(error);
  }
}

// POST: add book to collection with unique id
export async function createBook(book) {
  // create unique key of sorts
  const key = Math.floor(1000 + Math.random() * 9000)
  try {
    const cluster = await couchbaseConnect();
    const bucket = await getBucket(cluster);
    const scope = bucket.defaultScope();
    const collection = getCollection(scope);
    await collection.insert(key, book);
    // add key to created book and return
    return {...book, id: key};
  }catch(error) {
    console.log(error)
  }
}

// DELETE: remove book from collection by its id
export async function deleteBookById(key) {
  try {
    const cluster = await couchbaseConnect();
    const bucket = await getBucket(cluster);
    const scope = bucket.defaultScope();
    const collection = getCollection(scope);
    const result = await collection.remove(key);
    return key;
  }catch(error) {
    console.log(error)
  }
}

// PUT: update book in collection by passing the book properties to update and its id
export async function updateBookById(key, book) {
  try {
    const cluster = await couchbaseConnect();
    const bucket = await getBucket(cluster);
    const scope = bucket.defaultScope();
    const collection = getCollection(scope);
    await collection.replace(key, book);
    return book;
  }catch(error) {
    console.log(error)
  }
}


