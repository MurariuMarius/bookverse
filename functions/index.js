const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions/v2')

const { initializeApp } = require('firebase-admin/app')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')

const app = initializeApp()

const firestoreService = getFirestore()

const bookConditions = ['New', 'As New', 'Good', 'Fair', 'Poor']

exports.createOffer = onCall(async (request) => {
  const getBookDetails = async (ISBN) => {
    const bookFound = () => {
      return books.totalItems != 0 && books.items[0].volumeInfo.industryIdentifiers[0].identifier === ISBN
    }

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`)
    const books = await response.json();

    if (!bookFound()) {
      throw new Error('ISBN not found')
    }

    const book = books.items[0].volumeInfo

    const authors = book.authors
    const title = book.title

    return { title, authors }
  }

  const validateBookRequest = () => {
    const validISBN = (ISBN) => {
      return /^[0-9]{13}$/.test(ISBN)
    }

    const validPrice = (price) => {
      return /^(([1-9][0-9]{0,8})|0)([.,][0-9]{1,2})?$/.test(price)
    }

    if (!bookConditions.includes(request.data.condition)) {
      throw new HttpsError('invalid-argument', 'Invalid book condition')
    }
  
    if (!validISBN(request.data.ISBN.trim())) {
      throw new HttpsError('invalid-argument', 'Invalid ISBN')
    }

    if (!validPrice(request.data.price.trim())) {
      throw new HttpsError('invalid-argument', 'Invalid price')
    }
  }

  const storeBookIfNotInDB = async (book) => {
    const snapshot = await firestoreService.collection('books').doc(book.ISBN).get()
    if (!snapshot.exists) {
      await firestoreService.collection('books').doc(book.ISBN).set(book)
    }
  }

  const storeOffer = async (bookOffer) => {
    await firestoreService.collection('offers').add(bookOffer)
  }
  
  validateBookRequest()

  let book = {
    ISBN: request.data.ISBN.trim(),
  }

  const bookOffer = {
    sellerID: request.auth.uid,
    ISBN: book.ISBN,
    condition: request.data.condition,
    price: parseFloat(request.data.price.replace(',', '.')),
    createdAt: Timestamp.now()
  }

  try {
    const verifiedBookData = await getBookDetails(book.ISBN)
    book = { ...verifiedBookData, ...book }
  } catch (err) {
    const title = request.data.title.trim()
    const authors = request.data.authors.split(', ')

    book = { title: title, authors: authors, ...book }
  }
  
  try {
    await storeBookIfNotInDB(book)
    await storeOffer(bookOffer)
  } catch (err) {
    logger.log(err.message)
    throw new HttpsError('internal', err.message)
  }
  return [book, bookOffer]
});
