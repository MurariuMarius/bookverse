<template>
  
  <!-- test -->
  <div v-if="testBook && testOffers">
    <!-- <Book :book="testBook" :offers="testOffers" imageSource="http://books.google.com/books/content?id=4EBHUjNLuyIC&printsec=frontcover&img=1&zoom=1&source=gbs_api"/> -->
  </div>

 <section class="book-list" v-if="books.size != 0">
  <BookListItem v-for="[book, offers] in books" :key="book.ISBN" :book="book" :offers="offers" />
 </section>
</template>

<script>
import BookListItem from '@/components/BookListItem.vue'
import { onMounted, ref } from 'vue'
import useGetBooksWithOffers from '@/composables/useGetBooksWithOffers'

export default {
  components: { BookListItem },
  setup() {
    
    const { error, getBooksWithOffers } = useGetBooksWithOffers()
    
    const books = ref(new Map())

    const testBook = ref(null)
    const testOffers = ref(null)

    onMounted(async () => {
      books.value = await getBooksWithOffers()
      console.log(books.value)

      const el = books.value.keys().next()
      testBook.value = el.value
      testOffers.value = books.value.get(testBook.value)
    })

    return { books, testBook, testOffers }
  }
}
</script>

<style>
.book-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>