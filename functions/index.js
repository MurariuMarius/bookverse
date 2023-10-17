const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");

exports.createOffer = onCall((request) => {
  const getBookDetails = async (ISBN) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${ISBN}+isbn`);
    const books = await response.json();

    if (books.totalItems != 0) {
      const book = books.items[0].volumeInfo;

      const authors = book.authors;
      const title = book.title;

      // TODO: add book details to firestore, handle ISBN not found case
  
      return { authors, title };
    } else {
      throw new HttpsError('ISBN not found');
    }
  }

  if (Object.keys(request.data).length === 2) {
    return getBookDetails(request.data.ISBN.trim());
  } else {
    return 'Enter author, ISBN and title manually';
  }

});
