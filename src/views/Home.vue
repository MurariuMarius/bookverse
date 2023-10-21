<template>
  Home
  <Navbar />
  <BookListItem />
</template>

<script>
import BookListItem from '@/components/BookListItem.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { BookListItem, Navbar },
  setup() {

  }
}
</script>