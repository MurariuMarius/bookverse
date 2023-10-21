<template>
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

    onMounted(async () => {
      books.value = await getBooksWithOffers()
      console.log(books.value)
    })

    return { books }
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