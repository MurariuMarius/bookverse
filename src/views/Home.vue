<template>
  <Navbar />
  <main>
    <!-- <CreateOffer /> -->
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
import BookList from '@/components/BookList.vue'
import CreateOffer from '@/components/CreateOffer.vue';
import Navbar from '@/components/Navbar.vue'
import useGetDocByID from '@/composables/useGetDocByID';
import { storageService } from '@/firebase/config';
import { computed, ref, uploadBytes } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  components: { BookList, CreateOffer, Navbar },
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
  align-items: center;
}
form {
  display: flex;
  flex-direction: row;
  width: 60%;
  min-width: 300px;
  margin: 20px auto;
  align-items: center;
  justify-content: space-around;
}
.search {
  height: 25px;
  border-radius: 30px;
  text-align: center;
  margin-right: 15px;
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