<template>
  <main>
    <form @submit.prevent="searchBooks">
      <input class="search" type="text" placeholder="Search books..." v-model="search">
      <button>Search</button>
    </form>
    <div v-if="searchQuery">
      <h3 v-if="searchQuery">Showing results for <span>{{ searchQuery }}</span>:</h3>
      <h4 @click="clearSearch">X Clear search</h4>
    </div>
    <BookList :searchQuery="searchQuery"/>
  </main>
</template>

<script>
import BookList from '@/components/book/BookList.vue'
import Navbar from '@/components/Navbar.vue'

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: { BookList, Navbar },
  setup() {

    const search = ref('')
    const searchQuery = ref('')
    
    const router = useRouter()
    const route = useRoute()

    if (route.query.q) {
      searchQuery.value = route.query.q
    }

    const searchBooks = () => {
      router.push({ name: 'home', query: { q: search.value }})
      setTimeout(() => {
        router.go()
      }, 1)
    }

    const clearSearch = () => {
      search.value = ''
      searchBooks()
    }

    return { search, searchQuery, clearSearch, searchBooks }
  }
}
</script>

<style scoped>
main {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  row-gap: 30px;
  width: 100%;
}
form {
  display: flex;
  flex-direction: row;
  width: 60%;
  min-width: 300px;
  align-items: center;
  column-gap: 20px;
}
.search {
  height: 25px;
  border-radius: 30px;
  text-align: center;
}
span {
  font-weight: bold;
}
h3 {
  font-weight: 400;
  font-size: x-large;
}
h4:hover {
  cursor: pointer;
}
</style>