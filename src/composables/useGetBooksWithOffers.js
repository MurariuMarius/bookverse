import { firestoreService } from "@/firebase/config"
import { ref } from "vue"

import useGetOffersForBook from '@/composables/useGetOffersForBook'

const error = ref('') 
const { getOffersForBook } = useGetOffersForBook()

const getBooksWithOffers = async (search) => {
  
  if (search) {
    search = search.toLowerCase()
  }

  const books = []
  
  const bookSnapshot = await firestoreService.collection('books').get()
  bookSnapshot.forEach(doc => books.push(doc.data()))

  let filteredBooks = []

  if (search) {
    books.filter(b => {
      return b.ISBN === search ||
      b.authors
        .some(author => {
          return author.toLowerCase().split(" ").includes(search);
        }) ||
      b.title.toLowerCase().split(" ").includes(search)
    }).forEach(d => filteredBooks.push(d))
  } else {
    filteredBooks = books
  }
  
  const booksWithOffers = new Map();
  
  await Promise.all(
    filteredBooks.map(async (book) => {
      const offersForBook = await getOffersForBook(book.ISBN)
      if (offersForBook.length > 0) {
        booksWithOffers.set(book, offersForBook)
      }
    })
  )

  return booksWithOffers;
}

const useGetBooksWithOffers = () => {
  return { error, getBooksWithOffers }
}

export default useGetBooksWithOffers