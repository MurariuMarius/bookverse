import { firestoreService } from "@/firebase/config"
import { ref } from "vue"

const error = ref('') 

const getBooksWithOffers = async () => {
  const books = []

  const bookSnapshot = await firestoreService.collection('books').get()
  bookSnapshot.forEach(doc => books.push(doc.data()))

  const getOffersForBook = async (book) => {
    const offers = []
    console.log('Searching for ' + book.ISBN);
    const snapshot = await firestoreService.collection('offers')
      .where('ISBN', '==', book.ISBN)
      .get()
    snapshot
      .forEach(doc => offers.push(doc.data()))
    return offers
  }

  const booksWithOffers = new Map();

  for (const book of books) {
    const offersForBook = await getOffersForBook(book)
    if (offersForBook.length > 0) {
      booksWithOffers.set(book, offersForBook)
    }
  }

  return booksWithOffers;
}

const useGetBooksWithOffers = () => {
  return { error, getBooksWithOffers }
}

export default useGetBooksWithOffers