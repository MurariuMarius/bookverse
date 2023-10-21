<template>
  <div class="book" v-if="book">
    <div class="headSection">
      <div class="bookDetails">
        <img :src="imageSource" :alt="book.title">
        <h2>{{ book.title }}</h2>
        <h2>{{ book.authors }}</h2>
        <h3>{{ book.ISBN }}</h3>
      </div>
      <div class="offers">
        <h3>Available offers:</h3>
        <Offer v-for="offer in offersSortedByPrice" :offer="offer" />
        <BookConditionsDescription />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import BookConditionsDescription from '@/components/BookConditionsDescription.vue';
import Offer from '@/components/Offer.vue';

import useGetOffersForBook from '@/composables/useGetOffersForBook'
import useGetDocByID from '@/composables/useGetDocByID'
import useGetBookIcon from '@/composables/useGetBookIcon'

export default {
  components: { BookConditionsDescription, Offer, BookConditionsDescription },
  props: { ISBN: String },
  setup(props) {

    const book = ref(false)
    const offers = ref(null)

    const offersSortedByPrice = computed(() => {
      if (offers.value) {
        return offers.value.sort((a, b) => a.price - b.price)
      }
    })

    const { getOffersForBook } = useGetOffersForBook()
    const { getDocByID } = useGetDocByID()
    const { imageSource, getBookIcon } = useGetBookIcon()

    onMounted(async () => {
      book.value = await getDocByID('books', props.ISBN)
      offers.value = await getOffersForBook(props.ISBN)
      await getBookIcon(props.ISBN)
    })

    return { book, offersSortedByPrice, imageSource }
  }
}
</script>

<style scoped>
.book {
  margin: 20px auto;
  background-color: #e7fdea;
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-flow: column;
}

.headSection {
  margin: 5% auto;
  display: flex;
  width: 100%;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.bookDetails {
  justify-content: center;
  display: flex;
  flex-flow: column;
}

.offers {
  margin: auto 3%;
  display: flex;
  flex-flow: column;
  row-gap: 30px;
}

.offers h3 {
  font-weight: 600;
  align-self: flex-start;
}

img {
  margin: auto;
  height: 500px;
  max-width: 90%;
}
</style>