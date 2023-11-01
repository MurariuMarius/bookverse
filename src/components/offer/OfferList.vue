<template>
  <p v-if="!offers.size">You haven't made any offers yet.</p>
  <p v-else>Sold items will be marked green.</p>
  <div v-if="offers">
    <Offer v-for="[offer, book] in offers" :offer="offer" :book="book" />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import Offer from './Offer.vue'
import useGetOffersForUserByID from '@/composables/services/useGetOffersForUserByID'

export default {
  components: { Offer },
  props: { uid: String },
  setup(props) {
    const { getOffersForUserByID } = useGetOffersForUserByID()

    const offers = ref(new Map())

    onMounted(async () => {
      offers.value = await getOffersForUserByID(props.uid, 'seller')
      offers.value = new Map([...offers.value].sort((a, b) => a[0].createdAt.seconds < b[0].createdAt.seconds ? 1 : -1))
    })

    return { offers }
  }
}
</script>