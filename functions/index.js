const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");

const bookConditions = ['New', 'As New', 'Good', 'Fair', 'Poor'];

exports.createOffer = onCall(async (request) => {
  const getBookDetails = async (ISBN) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${ISBN}+isbn`);
    const books = await response.json();

    if (books.totalItems != 0) {

      const book = books.items[0].volumeInfo;

      const authors = book.authors;
      const title = book.title;
  
      return { title, authors };
    } else {
      throw new Error('ISBN not found');
    }
  }

  const validISBN = (ISBN) => {
    return /^[0-9]{13}$/.test(ISBN)
  }

  if (!bookConditions.includes(request.data.condition)) {
    throw new HttpsError('Invalid book condition')
  }

  if (!validISBN(request.data.ISBN.trim())) {
    throw new HttpsError('Invalid ISBN')
  }

  let book = {
    ISBN: request.data.ISBN.trim(),
    condition: request.data.condition
  }

  try {
    const verifiedBook = await getBookDetails(book.ISBN)
    book = { ...verifiedBook, ...book }
  } catch (err) {
    const title = request.data.title.trim()
    const authors = request.data.authors.split(', ')

    book = { title: title, authors: authors, ...book }
  }
  
  return book
});
