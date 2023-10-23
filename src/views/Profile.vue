<template>
  Hello, {{ user.displayName }}
  <section class="offers">
    <h1>My offers</h1>
    <p>Sold items will be marked green.</p>
    <div v-if="offers">
      <Offer v-for="[offer, book] in offers" :offer="offer" :book="book" />
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

    onMounted(async () => {
      offers.value = await getOffersForUserByID(user.value.uid, 'seller')
      console.log(offers.value);
    })

    return { offers, user }
  }
}
</script>

<style>
.offers {
  margin: auto;
  max-width: 1300px;
}
</style>