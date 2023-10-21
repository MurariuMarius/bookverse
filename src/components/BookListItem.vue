<template>
  <article class="book" @click="viewBook">
    <img :src=imageSource alt="book icon" class="book-icon">
    <div>
      <h2 class="title">{{ book.title }}</h2>
      <h3 class="author">{{ book.authors }}</h3>
    </div>
    <div class="price">
      <p>From</p>
      <h2>{{ price }}</h2>
      <h2>€</h2>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue';

import useGetBookIcon from '@/composables/useGetBookIcon'
import { useRouter } from 'vue-router';

export default {
  props: { book: Object, offers: Array[Object] },
  setup(props) {

    const price = computed(() => {
      return Math.min(...props.offers.map(o => o.price))
    })
    
    const router = useRouter()
    const { imageSource, getBookIcon } = useGetBookIcon()

    getBookIcon(props.book.ISBN)
    
    const viewBook = () => {
      router.push({ name: 'book', params: { ISBN: props.book.ISBN }})
    }

    return { imageSource, price, viewBook }
  }
}
</script>

<style scoped>
img {
  margin: auto;
  height: 300px;
  max-width: 90%;
}

.book {
  background-color: #e8e5e5;
  padding: 20px 35px;
  border-radius: 20px;
  justify-content: center;
  margin: 20px;
  display: flex;
  flex-direction: column;
  width: 275px;
}

.book:hover {
  cursor: pointer;
}

.price {
  bottom: 0;
  display: inline-flex;
  margin-bottom: 0;
  align-items: baseline;
  justify-content: flex-end;
  width: 100%;
  align-self: flex-end;
}

.price > * {
  margin-bottom: 0;
}

.price h2 {
  color: #01bf14;
  margin-left: 10px
}

.title {
  font-size: xx-large;
}

.author {
  font-size: x-large;
  font-weight: 400;
}
</style>