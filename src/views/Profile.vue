<template>
  Hello, {{ user.displayName }} 👋
  <Spinner v-if="!error && !offers.size" />
  <NotificationAfterRedirection v-else :route="route" :window="getWindow()" />
  <Notification v-if="showNotification" :message="notificationMessage" :type="notificationType" />
  <section class="user">
    <h1 @click="toggleDeliveryDetails">Delivery details</h1>
    <div v-if="showDeliveryDetails">
      <DeliveryDetails  @sentData="getDeliveryDetails"/>
      <button @click="handleChangeDeliveryDetails">Change</button>
    </div>
  </section>
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

import DeliveryDetails from '@/components/DeliveryDetails.vue'
import NotificationAfterRedirection from '@/components/NotificationAfterRedirection.vue'
import Notification from '@/components/Notification.vue'
import Offer from '@/components/Offer.vue'
import Spinner from '@/components/Spinner.vue'

import { useRoute } from 'vue-router'

import getUser from '@/composables/getUser'
import useGetOffersForUserByID from '@/composables/useGetOffersForUserByID'
import useChangeDeliveryDetails from '@/composables/useChangeDeliveryDetails'
import useNotification from '@/composables/useNotification'

export default {
  components: { DeliveryDetails, Notification, NotificationAfterRedirection, Offer, Spinner },
  setup(props) {
    const { user } = getUser()
    const { name, phone, address, phoneError, changeDeliveryDetails } = useChangeDeliveryDetails()
    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const { error, getOffersForUserByID } = useGetOffersForUserByID()

    const route = useRoute()

    const offers = ref(new Map())
    
    const showDeliveryDetails = ref(false)

    onMounted(async () => {
      offers.value = await getOffersForUserByID(user.value.uid, 'seller')
      offers.value = new Map([...offers.value].sort((a, b) => a[0].createdAt.seconds < b[0].createdAt.seconds ? 1 : -1))
    })

    const getWindow = () => {
      return window
    }

    const getDeliveryDetails = (details) => {
      name.value = details.name
      address.value = details.address
      phone.value = details.phone
      phoneError.value = details.phoneError
    }

    const toggleDeliveryDetails = () => {
      showDeliveryDetails.value = !showDeliveryDetails.value
    }

    const handleChangeDeliveryDetails = async () => {
      if (!name.value || !address.value || phoneError.value) {
        return
      }

      try {
        changeDeliveryDetails('users', user.value.uid, '_id')
        showDeliveryDetails.value = false
        toggleNotification('Changed delivery details.', 'success', 2000)
      } catch (err) {
        toggleNotification('Error: ' + err.message, 'error', 2000)
      }
    } 

    return { offers, error, showDeliveryDetails, route, user, showNotification, notificationMessage, notificationType, getDeliveryDetails, getWindow, handleChangeDeliveryDetails, toggleDeliveryDetails }
  }
}
</script>

<style>
.offers {
  margin: auto;
  max-width: 1300px;
}

.user h1:hover {
  cursor: pointer;
  text-decoration: underline;
}

</style>