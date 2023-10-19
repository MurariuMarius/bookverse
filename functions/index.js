const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions/v2')

const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const app = initializeApp()

const firestoreService = getFirestore()

const bookConditions = ['New', 'As New', 'Good', 'Fair', 'Poor']

exports.createOffer = onCall(async (request) => {
  const getBookDetails = async (ISBN) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`)
    const books = await response.json();

    if (books.totalItems != 0) {

      const book = books.items[0].volumeInfo

      const authors = book.authors
      const title = book.title
  
      return { title, authors }
    } else {
      throw new Error('ISBN not found')
    }
  }

  const validateBookRequest = (book) => {
    const validISBN = (ISBN) => {
      return /^[0-9]{13}$/.test(ISBN)
    }

    if (!bookConditions.includes(request.data.condition)) {
      throw new HttpsError('Invalid book condition')
    }
  
    if (!validISBN(request.data.ISBN.trim())) {
      throw new HttpsError('Invalid ISBN')
    }
  }

  const storeBookIfNotInDB = async (book) => {
    const snapshot = await firestoreService.collection('books').doc(book.ISBN).get()
    if (!snapshot.exists) {
      await firestoreService.collection('books').doc(book.ISBN).set(book)
    }
  }
  
  let book = {
    ISBN: request.data.ISBN.trim(),
    condition: request.data.condition
  }

  validateBookRequest(book)

  try {
    const verifiedBook = await getBookDetails(book.ISBN)
    book = { ...verifiedBook, ...book }
  } catch (err) {
    const title = request.data.title.trim()
    const authors = request.data.authors.split(', ')

    book = { title: title, authors: authors, ...book }
  }
  
  try {
    await storeBookIfNotInDB(book)
  } catch (err) {
    logger.log(err.message)
  }
  return book
});
