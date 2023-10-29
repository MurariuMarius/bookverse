<template>
  <Spinner v-if="(!error && !offers.size) || !ordersLoaded" />
  <NotificationAfterRedirection v-else :route="route" :window="getWindow()" />
  <Notification v-if="showNotification" :message="notificationMessage" :type="notificationType" />
  <section class="welcome">
    <h1>Hello, {{ user.displayName }} 👋</h1>
  </section>
  <section class="user">
    <h1 @click="toggleDeliveryDetails">Delivery details</h1>
    <div v-if="showDeliveryDetails">
      <DeliveryDetails  @sentData="getDeliveryDetails" />
      <button @click="handleChangeDeliveryDetails">Change</button>
    </div>
  </section>
  <section class="orders">
    <h1 @click="toggleMyOrders">My orders</h1>
    <div v-if="showOrders">
      <p>You haven't placed any orders yet.</p>
      <div v-if="orders" class="orderList">
        <Order v-for="[order, orderItems] in orders" :key="order" :order="order" :orderItems="orderItems" @loaded="pageLoaded" />
      </div>
    </div>
  </section>
  <section class="offers">
    <h1 @click="toggleMyOffers">My offers</h1>
    <div v-if="showOffers">
      <p v-if="error">You haven't made any offers yet.</p>
      <p v-else>Sold items will be marked green.</p>
      <div v-if="offers">
        <Offer v-for="[offer, book] in offers" :offer="offer" :book="book"/>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref } from 'vue'

import DeliveryDetails from '@/components/DeliveryDetails.vue'
import NotificationAfterRedirection from '@/components/NotificationAfterRedirection.vue'
import Notification from '@/components/Notification.vue'
import Offer from '@/components/Offer.vue'
import Order from '@/components/Order.vue'
import Spinner from '@/components/Spinner.vue'

import { useRoute } from 'vue-router'

import getUser from '@/composables/getUser'
import useGetOffersForUserByID from '@/composables/useGetOffersForUserByID'
import useGetOrdersForUserByID from '@/composables/useGetOrdersForUserByID'
import useChangeDeliveryDetails from '@/composables/useChangeDeliveryDetails'
import useNotification from '@/composables/useNotification'
import { firestoreService } from '@/firebase/config'

export default {
  components: { DeliveryDetails, Notification, NotificationAfterRedirection, Offer, Order, Spinner },
  setup(props) {
    const { user } = getUser()
    const { name, phone, address, phoneError, changeDeliveryDetails } = useChangeDeliveryDetails()
    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const { error, getOffersForUserByID } = useGetOffersForUserByID()
    const { getOrdersForUserByID } = useGetOrdersForUserByID()

    const route = useRoute()

    const ordersLoaded = ref(false)


    const offers = ref(new Map())
    const orders = ref(new Map())
    
    const showDeliveryDetails = ref(false)
    const showOrders = ref(true)
    const showOffers = ref(true)

    onMounted(async () => {
      offers.value = await getOffersForUserByID(user.value.uid, 'seller')
      offers.value = new Map([...offers.value].sort((a, b) => a[0].createdAt.seconds < b[0].createdAt.seconds ? 1 : -1))

      orders.value = await getOrdersForUserByID(user.value.uid)
      console.log(orders.value);
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

    const toggleMyOffers = () => {
      showOffers.value = !showOffers.value
    }

    const toggleMyOrders = () => {
      showOrders.value = !showOrders.value
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

    const pageLoaded = () => {
      ordersLoaded.value = true
    }

    return { showOffers, showOrders, pageLoaded, ordersLoaded, orders, offers, error, showDeliveryDetails, route, user, showNotification, notificationMessage, notificationType, getDeliveryDetails, getWindow, handleChangeDeliveryDetails, toggleDeliveryDetails, toggleMyOrders, toggleMyOffers }
  }
}
</script>

<style scoped>
.offers, .user, .orders, .welcome {
  margin: auto;
  width: 100%;
  max-width: 1300px;
}

.welcome h1 {
  font-weight: 300;
  font-size: 40px;
}

.welcome h1:hover {
  cursor: default;
  text-decoration: none;
}

section > h1:hover {
  cursor: pointer;
  text-decoration: underline;
}

.orderList {
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}
</style>