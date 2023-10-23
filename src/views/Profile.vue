<template>
  Hello, {{ user.displayName }}
  <div v-if="success" class="success">
    <p>Success!</p>
  </div>
  <section class="offers">
    <h1>My offers</h1>
    <p>Sold items will be marked green.</p>
    <div v-if="offers">
      <Offer v-for="[offer, book] in offers" :offer="offer" :book="book" @success="toggleSuccess"/>
    </div>
  </section>
</template>

<script>
import { onMounted, ref } from 'vue'

import Offer from '@/components/Offer.vue'

import getUser from '@/composables/getUser'
import useGetOffersForUserByID from '@/composables/useGetOffersForUserByID'

export default {
  components: { Offer },
  setup() {
    const { user } = getUser()

    const { error, getOffersForUserByID } = useGetOffersForUserByID()

    const offers = ref(new Map())
    const success = ref(false)

    onMounted(async () => {
      offers.value = await getOffersForUserByID(user.value.uid, 'seller')
      console.log(offers.value);
    })

    const toggleSuccess = () => {
      success.value = true
      setTimeout(() => {
        success.value = false
      }, 2000)
    }

    return { offers, user, success, toggleSuccess }
  }
}
</script>

<style>
.offers {
  margin: auto;
  max-width: 1300px;
}

.success {
  width: 20%;
  min-width: 300px;
  display: flex;
  justify-content: center;
  background-color: var(--dark-green);
  border-radius: 25px;
  color: white;
}
</style>