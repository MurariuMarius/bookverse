<template>
  <Notification v-if="showNotification" :message="notificationMessage" :type="notificationType" />
  <div class="book" v-if="book">
    <div class="headSection">
      <section class="bookDetails">
        <img :src="imageSource" :alt="book.title" @load="imageLoad">
        <h2>{{ book.title }}</h2>
        <h2>{{ authors }}</h2>
        <h3>ISBN: {{ book.ISBN }}</h3>
      </section>
      <section class="offers">
        <h3>Available offers:</h3>
        <OfferPreview v-for="offer in offersSortedByPrice" :offer="offer" @offerSelected="addItemToShoppingCart" />
        <BookConditionsDescription />
      </section>
    </div>
  </div>
  <div v-if="!pageLoaded">
    <Spinner />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'

import BookConditionsDescription from '@/components/book/BookConditionsDescription.vue'
import Notification from '@/components/utils/Notification.vue'
import OfferPreview from '@/components/offer/OfferPreview.vue'
import Spinner from '@/components/utils/Spinner.vue'

import useGetOffersForBook from '@/composables/services/useGetOffersForBook'
import useGetDocByID from '@/composables/utils/useGetDocByID'
import useGetBookIcon from '@/composables/utils/useGetBookIcon'
import useNotification from '@/composables/utils/useNotification'

import { shoppingCart } from '@/composables/shoppingCart'

export default {
  components: { BookConditionsDescription, Notification, OfferPreview, Spinner },
  props: { ISBN: String },
  setup(props) {
    const book = ref(false)
    const offers = ref(null)
    const pageLoaded = ref(false)

    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const authors = computed(() => {
      return book.value.authors.join(', ')
    })
    
    const offersSortedByPrice = computed(() => {
      if (offers.value) {
        return offers.value.sort((a, b) => a.price - b.price)
      }
    })

    const { getOffersForBook } = useGetOffersForBook()
    const { getDocByID } = useGetDocByID()
    const { imageSource, getBookIcon } = useGetBookIcon()

    onMounted(async () => {
      [book.value, offers.value] = await Promise.all(
        [getDocByID('books', props.ISBN), getOffersForBook(props.ISBN)]
      )
      getBookIcon(book.value.imageURL)
    })
    
    const imageLoad = () => {
      pageLoaded.value = true
    }
    
    const addItemToShoppingCart = (offer) => {
      shoppingCart.addOrder({ book, offer })
      console.log(shoppingCart.getOrderCount)
      toggleNotification('Item added to cart.', 'success', 2000)
    }
    
    return { authors, book, offersSortedByPrice, imageSource, pageLoaded, showNotification, notificationMessage,
      notificationType, imageLoad, addItemToShoppingCart }
  }
}
</script>

<style scoped>
.book {
  margin: 20px auto;
  background-color: var(--light-green);
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
  align-items: center;
  display: flex;
  flex-flow: column;
  row-gap: 15px;
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

.bookDetails h2, .bookDetails h3 {
  margin: 0;
}
</style>