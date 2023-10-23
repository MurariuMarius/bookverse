const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions/v2')

const { initializeApp } = require('firebase-admin/app')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')
const { getStorage, getDownloadURL } = require('firebase-admin/storage')
const { log } = require('firebase-functions/logger')

const app = initializeApp()

const firestoreService = getFirestore()
const storageBucket = getStorage().bucket()

const bookConditions = ['New', 'As New', 'Good', 'Fair', 'Poor']

exports.updateOffer = onCall(async (request) => {
  const parseOfferUpdateRequest = (request) => {
    const validatePrice = (price) => {
      const validPrice = parseFloat(price.replace(',', '.'))
      if (isNaN(validPrice)) {
        throw new HttpsError('invalid-argument', 'Invalid price')
      }
      return price
    }

    const condition = request.data.offer.condition

    if (!bookConditions.includes(condition)) {
      throw new HttpsError('invalid-argument', 'Invalid book condition')
    }

    const price = validatePrice(request.data.offer.price)

    return [ price, condition ]
  }

  const [ price, condition ]  = parseOfferUpdateRequest(request)

  firestoreService.collection('offers')
    .doc(request.data.offer.id)
    .update({ price, condition })
})

exports.createOffer = onCall(async (request) => {
  const getBookDetails = async (ISBN) => {
    const bookFound = () => {
      return books.totalItems != 0 && (
        books.items[0].volumeInfo.industryIdentifiers[0].identifier === ISBN ||
        books.items[0].volumeInfo.industryIdentifiers[1].identifier === ISBN )
    }

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`)
    const books = await response.json();

    if (!bookFound()) {
      throw new Error('ISBN not found')
    }

    const book = books.items[0].volumeInfo

    const authors = book.authors
    const title = book.title
    
    let imageURL = null
    try {
      imageURL = book.imageLinks.thumbnail
    } catch (err) {
      logger.log(`Could not find image for ${ISBN}`)
    }

    return { title, authors, imageURL }
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

  const getUserID = () => {
    try {
      return request.auth.uid
    } catch (err) {
      throw new HttpsError('unauthenticated', err.message)
    }
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

  validateBookRequest()

  let book = {
    ISBN: request.data.ISBN.trim(),
  }

  const bookOffer = {
    sellerID: getUserID(),
    ISBN: book.ISBN,
    condition: request.data.condition,
    price: parseFloat(request.data.price.replace(',', '.')),
    createdAt: Timestamp.now(),
    status: 'new'
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
    book = await addImageURLIfPresent(book)
  } catch (err) {
    logger.log(err.message)
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
