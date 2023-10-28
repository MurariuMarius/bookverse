<template>
<h1>Admin</h1>
<Notification v-if="showNotification" :message="notificationMessage" :type="notificationType"/>
<section class="user">
  <h2>Reset user email / password</h2>
  <form @submit.prevent="">
    <input type="text" placeholder="User ID" required v-model="userID">
    <input type="email" placeholder="New email" required v-model="newEmail">
    <button>Reset email</button>
  </form>
  <button @click="">Reset password</button>
</section>
<section class="order">
  <h2>Manage orders</h2>
  <input type="text" placeholder="Order ID" required v-model="order">
  <h3>Remove item</h3>
  <form @submit.prevent="">
    <input type="text" placeholder="Offer ID" required v-model="orderItem">
    <button>Remove item</button>
  </form>
  <h3>Change delivery details</h3>
  <form @submit.prevent="">
    <input type="text" placeholder="Full name" required v-model="name">
    <input type="text" placeholder="Phone number" required v-model="phone">
    <input type="text" placeholder="Address" required v-model="address">
  </form>
  <button>Remove order</button>
</section>
<section class="offer">
  <h2>Manage offers</h2>
  <form @submit.prevent="handleUpdateOffer">
    <input type="text" placeholder="Offer ID" required v-model="offerID">
    <input type="text" placeholder="Price" required v-model="offerPrice">
    <input type="text" placeholder="Book condition" required v-model="bookCondition">
    <button>Edit offer</button>
  </form>
  <button>Delete offer</button>
</section>
</template>

<script>
import { ref } from 'vue'

import useGetDocByID from '@/composables/useGetDocByID'
import useManageOffer from '@/composables/useManageOffer'
import useNotification from '@/composables/useNotification'

import Notification from '@/components/Notification.vue'

export default {
  components: { Notification },
  setup() {
    const { bookCondition, price: offerPrice, updateOffer, deleteOffer } = useManageOffer()
    const { error: offerIDError, getDocByID } = useGetDocByID()

    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const offerID = ref('')

    const handleUpdateOffer = async () => {
      const offer = await getDocByID('offers', offerID.value)
      try {
        updateOffer({ ...offer, id: offerID.value })
        toggleNotification('Offer updated.', 'success', 2000)
      } catch (err) {
        console.log(err, err.message)
      }
    }

    return { showNotification, notificationMessage, notificationType, offerID, offerPrice, bookCondition, handleUpdateOffer }
  }
}
</script>

<style scoped>
section {
  border-top: solid;
  margin-top: 25px;
}
</style>