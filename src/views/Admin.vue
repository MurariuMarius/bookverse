<template>
  <div class="admin">
    <h1>Admin</h1>
    <Notification v-if="showNotification" :message="notificationMessage" :type="notificationType"/>
    <section class="user">
      <h2>Reset user email / password</h2>
      <input type="text" placeholder="User ID" required v-model="userID">
      <form @submit.prevent="handleResetEmail">
        <input type="email" placeholder="New email" required v-model="newEmail">
        <button>Reset email</button>
      </form>
      <button @click="handleResetPassword">Reset password</button>
      <button @click="handleDeleteUser">Delete user</button>
    </section>
    <section class="order">
      <h2>Manage orders</h2>
      <input type="text" placeholder="Order ID" required v-model="orderID">
      <h3>Remove item</h3>
      <form @submit.prevent="">
        <input type="text" placeholder="Offer IDs" required v-model="orderItems">
        <button @click="handleRemoveItems">Remove item</button>
      </form>
      <h3>Change delivery details</h3>
      <form @submit.prevent="handleChangeDeliveryDetails">
        <input type="text" placeholder="Full name" required v-model="name">
        <input type="text" placeholder="Phone number" required v-model="phone">
        <input type="text" placeholder="Address" required v-model="address">
        <button>Change</button>
      </form>
      <button @click="handleDeleteOrder">Remove order</button>
    </section>
    <section class="offer">
      <h2>Manage offers</h2>
      <form @submit.prevent="handleUpdateOffer">
        <input type="text" placeholder="Offer ID" required v-model="offerID">
        <input type="text" placeholder="Price" required v-model="offerPrice">
        <input type="text" placeholder="Book condition" required v-model="bookCondition">
        <button>Edit offer</button>
      </form>
      <button @click="handleDeleteOffer">Delete offer</button>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions' 

import useGetDocByID from '@/composables/utils/useGetDocByID'
import useManageOffer from '@/composables/services/useManageOffer'
import useNotification from '@/composables/utils/useNotification'
import useChangeDeliveryDetails from '@/composables/services/useChangeDeliveryDetails'
import sendUserPasswordResetEmail from '@/composables/auth/sendUserPasswordResetEmail'

import Notification from '@/components/utils/Notification.vue'

export default {
  components: { Notification },
  setup() {
    const { bookCondition, price: offerPrice, updateOffer, deleteOffer } = useManageOffer()
    const { error: offerIDError, getDocByID } = useGetDocByID()
    const { name, phone, address, changeDeliveryDetails } = useChangeDeliveryDetails()

    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const userID = ref('')
    const newEmail = ref('')
    const orderID = ref('')
    const orderItems = ref('')
    const offerID = ref('')

    const functions = getFunctions()

    const handleResetEmail = async () => {
      const resetEmail = httpsCallable(functions, 'manageUser-resetEmail')
      try {
        await resetEmail({ uid: userID.value, email: newEmail.value })
        toggleNotification(`Email set to ${newEmail.value}.`, 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleDeleteUser = async () => {
      const deleteUser = httpsCallable(functions, 'manageUser-deleteUser')
      try {
        await deleteUser({ uid: userID.value })
        toggleNotification('User deleted.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleResetPassword = async () => {
      try {
        await sendUserPasswordResetEmail(userID.value)
        toggleNotification('Password reset email sent.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleUpdateOffer = async () => {
      const offer = await getDocByID('offers', offerID.value)
      try {
        await updateOffer({ ...offer, id: offerID.value })
        toggleNotification('Offer updated.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }
    
    const handleDeleteOffer = async () => {
      const offer = await getDocByID('offers', offerID.value)
      try {
        await deleteOffer({ ...offer, id: offerID.value })
        toggleNotification('Offer deleted.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleRemoveItems = async () => {
      const removeItems = httpsCallable(functions, 'manageOrder-removeItems')
      try {
        await removeItems({ orderID: orderID.value, offerIDs: orderItems.value })
        toggleNotification('Successfully removed items.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleChangeDeliveryDetails = async () => {
      try {
        await changeDeliveryDetails('orders', orderID.value, 'buyerID')
        toggleNotification('Updated delivery details.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleDeleteOrder = async () => {
      console.log(orderID.value)
      const deleteOrder = httpsCallable(functions, 'manageOrder-deleteOrder')
      try {
        await deleteOrder({ orderID: orderID.value })
        toggleNotification('Order deleted.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    return {
      userID, newEmail, handleResetEmail, handleDeleteUser, handleResetPassword,
      orderID, orderItems, name, phone, address, showNotification, handleRemoveItems, handleChangeDeliveryDetails, handleDeleteOrder,
      notificationMessage, notificationType,
      offerID, offerPrice, bookCondition, handleUpdateOffer, handleDeleteOffer
    }
  }
}
</script>

<style scoped>
.admin {
  width: 100%;
  align-items: flex-start;
}

h1 {
  text-align: left;
}

section {
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: solid;
  margin-top: 25px;
}

button {
  margin-bottom: 20px;
}
</style>