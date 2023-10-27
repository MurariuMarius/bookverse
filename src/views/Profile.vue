<template>
  Hello, {{ user.displayName }} 👋
  <Spinner v-if="!error && !offers.size" />
  <NotificationAfterRedirection v-else :route="route" :window="getWindow()" />
  <section class="offers">
    <h1>My offers</h1>
    <p v-if="error">You haven't made any offers yet.</p>
    <p v-else>Sold items will be marked green.</p>
    <div v-if="offers">
      <Offer v-for="[offer, book] in offers" :offer="offer" :book="book"/>
    </div>
  </section>
</template>

<script>
import { onMounted, ref } from 'vue'

import NotificationAfterRedirection from '@/components/NotificationAfterRedirection.vue'
import Offer from '@/components/Offer.vue'
import Spinner from '@/components/Spinner.vue'

import getUser from '@/composables/getUser'
import useGetOffersForUserByID from '@/composables/useGetOffersForUserByID'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: { NotificationAfterRedirection, Offer, Spinner },
  setup(props) {
    const { user } = getUser()

    const { error, getOffersForUserByID } = useGetOffersForUserByID()

    const route = useRoute()

    const offers = ref(new Map())
    const showMessage = ref(false)

    const message = ref('')

    onMounted(async () => {
      offers.value = await getOffersForUserByID(user.value.uid, 'seller')
    })

    const getWindow = () => {
      return window
    }

    return { offers, error, route, user, message, showMessage, getWindow }
  }
}
</script>

<style>
.offers {
  margin: auto;
  max-width: 1300px;
}

</style>