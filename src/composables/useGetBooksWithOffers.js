import { firestoreService } from "@/firebase/config"
import { ref } from "vue"

import useGetOffersForBook from '@/composables/useGetOffersForBook'

const error = ref('') 
const { getOffersForBook } = useGetOffersForBook()

const getBooksWithOffers = async () => {
  const books = []

  const bookSnapshot = await firestoreService.collection('books').get()
  bookSnapshot.forEach(doc => books.push(doc.data()))

  const booksWithOffers = new Map();

  for (const book of books) {
    const offersForBook = await getOffersForBook(book.ISBN)
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