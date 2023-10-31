const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions/v2')

const { Timestamp } = require('firebase-admin/firestore')
const { getDownloadURL } = require('firebase-admin/storage')

const { firestoreService, storageBucket } = require('../admin')

const bookConditions = ['New', 'As New', 'Good', 'Fair', 'Poor']

exports.createOffer = onCall(async (request) => {

  const parseBookData = async (request) => {

    const getBookDetails = async (book) => {
      const bookFound = () => {
        return books.totalItems != 0 && (
          books.items[0].volumeInfo.industryIdentifiers[0].identifier === book.ISBN ||
          books.items[0].volumeInfo.industryIdentifiers[1].identifier === book.ISBN)
      }
  
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}`)
      const books = await response.json();
  
      if (!bookFound()) {
        return book
      }
  
      const bookData = books.items[0].volumeInfo
  
      if (bookData.title) {
        book.title = bookData.title
      }

      if (bookData.authors) {
        book.authors = bookData.authors
      }
  
      try {
        book.imageURL = bookData.imageLinks.thumbnail
      } catch (err) {
        logger.log(`Could not find image for ${book.ISBN}`)
      }
  
      return book
    }
  
    const addImageURLIfPresent = async (book) => {
      if (!book.imageURL) {
        return book
      }
  
      const getFileFromURL = async (URL) => {
        let response = await fetch(URL)
        let data = await response.blob()
        let file = data.arrayBuffer()
        return file
      }
  
      const fileRef = storageBucket.file(`books/${book.ISBN}`)
      const file = await getFileFromURL(book.imageURL)
      await fileRef.save(new Uint8Array(file))
  
      const downloadURL = await getDownloadURL(fileRef)
  
      book.imageURL = downloadURL
  
      return book
    }

    let book = {
      ISBN: request.data.ISBN.trim(),
      title: request.data.title.trim(),
      authors: request.data.authors.split(', '),
      imageURL: null
    }
    
    book = await getBookDetails(book)
    book = await addImageURLIfPresent(book)

    return book
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

    if (!request.data.title || !request.data.authors) {
      throw new HttpsError('invalid-argument', 'All fields are mandatory')
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

  const getUserID = () => {
    try {
      return request.auth.uid
    } catch (err) {
      throw new HttpsError('unauthenticated', err.message)
    }
  }

  validateBookRequest()

  const book = await parseBookData(request)

  const bookOffer = {
    sellerID: getUserID(),
    ISBN: book.ISBN,
    condition: request.data.condition,
    price: parseFloat(request.data.price.replace(',', '.')),
    createdAt: Timestamp.now(),
    status: 'available'
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