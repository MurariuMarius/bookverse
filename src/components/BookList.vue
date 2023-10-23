<template>
  <p v-if="error">No content found.</p>
  <section class="book-list" v-if="!error && books.size != 0">
    <BookListItem v-for="[book, offers] in books" :key="book.ISBN" :book="book" :offers="offers" @componentLoaded="componentLoaded" />
  </section>
  <Spinner v-if="!error && !pageLoaded" />
</template>

<script>
import BookListItem from '@/components/BookListItem.vue'
import Spinner from '@/components/Spinner.vue'
import { onMounted, ref } from 'vue'
import useGetBooksWithOffers from '@/composables/useGetBooksWithOffers'

export default {
  components: { BookListItem, Spinner },
  props: { searchQuery : String },
  setup(props) {
    
    const { error, getBooksWithOffers } = useGetBooksWithOffers()
    
    const books = ref(new Map())

    const pageLoaded = ref(false)

    onMounted(async () => {
      console.log(props.searchQuery);
      books.value = await getBooksWithOffers(props.searchQuery)
      console.log(books.value)
    })

    const componentLoaded = () => {
      pageLoaded.value = true
    }

    console.log(error.value);

    return { books, componentLoaded, error, pageLoaded }
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