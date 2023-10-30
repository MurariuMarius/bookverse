<template>
  <Spinner v-if="(!offerError && !offers.size) || (!orderError && !orders.size) || (orders.size && !ordersLoaded)" />
  <NotificationAfterRedirection v-else :route="route" :window="getWindow()" />
  <Notification v-if="showNotification" :message="notificationMessage" :type="notificationType" />
  <section class="welcome">
    <h1>Hello, {{ user.displayName }} 👋</h1>
  </section>
  <section class="credentials">
    <h1 @click="toggleManageCredentials">Manage credentials</h1>
    <ManageCredentials v-if="showManageCredentials"/>
  </section>
  <section class="user">
    <h1 @click="toggleDeliveryDetails">Delivery details</h1>
    <div v-if="showDeliveryDetails">
      <DeliveryDetails  @sentData="getDeliveryDetails" />
      <button @click="handleChangeDeliveryDetails">Change</button>
    </div>
  </section>
  <section class="create-offer">
    <h1>Create offer</h1>
    <div>
      <CreateOffer />
    </div>
  </section>
  <section class="orders">
    <h1 @click="toggleMyOrders">My orders</h1>
    <div v-if="showOrders">
      <p v-if="!orders.size">You haven't placed any orders yet.</p>
      <div v-if="orders" class="orderList">
        <Order v-for="[order, orderItems] in orders" :key="order" :order="order" :orderItems="orderItems" @loaded="pageLoaded" />
      </div>
    </div>
  </section>
  <section class="offers">
    <h1 @click="toggleMyOffers">My offers</h1>
    <div v-if="showOffers">
      <p v-if="!offers.size">You haven't made any offers yet.</p>
      <p v-else>Sold items will be marked green.</p>
      <div v-if="offers">
        <Offer v-for="[offer, book] in offers" :offer="offer" :book="book"/>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import CreateOffer from '@/components/offer/CreateOffer.vue'
import DeliveryDetails from '@/components/forms/DeliveryDetails.vue'
import ManageCredentials from '@/components/forms/ManageCredentials.vue'
import NotificationAfterRedirection from '@/components/utils/NotificationAfterRedirection.vue'
import Notification from '@/components/utils/Notification.vue'
import Offer from '@/components/offer/Offer.vue'
import Order from '@/components/order/Order.vue'
import Spinner from '@/components/utils/Spinner.vue'

import getUser from '@/composables/auth/getUser'
import useGetOffersForUserByID from '@/composables/services/useGetOffersForUserByID'
import useGetOrdersForUserByID from '@/composables/services/useGetOrdersForUserByID'
import useChangeDeliveryDetails from '@/composables/services/useChangeDeliveryDetails'
import useNotification from '@/composables/utils/useNotification'

export default {
  components: { CreateOffer, DeliveryDetails, ManageCredentials, Notification, NotificationAfterRedirection, Offer, Order, Spinner },
  setup(props) {
    const { user } = getUser()
    const { name, phone, address, phoneError, changeDeliveryDetails } = useChangeDeliveryDetails()
    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const { error: offerError, getOffersForUserByID } = useGetOffersForUserByID()
    const { error: orderError, getOrdersForUserByID } = useGetOrdersForUserByID()

    const route = useRoute()

    const ordersLoaded = ref(false)


    const offers = ref(new Map())
    const orders = ref(new Map())
    
    const showManageCredentials = ref(false)
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

    const toggleManageCredentials = () => {
      showManageCredentials.value = !showManageCredentials.value
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

    return { showManageCredentials, showOffers, showOrders, pageLoaded, ordersLoaded, orders, offers, offerError, orderError, showDeliveryDetails, route, user, showNotification, notificationMessage, notificationType, getDeliveryDetails, getWindow, handleChangeDeliveryDetails, toggleDeliveryDetails, toggleMyOrders, toggleMyOffers, toggleManageCredentials }
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