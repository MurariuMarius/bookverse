<template>
  <div class="user">
    <section class="data">
      <h1>Username: {{ user.username }}</h1>
      <h1>Email: {{ user.email }}</h1>
    </section>
    <section class="credentials">
      <h2>Reset user email / password</h2>
      <form @submit.prevent="handleResetEmail">
        <input type="email" placeholder="New email" required v-model="newEmail">
        <button>Reset email</button>
      </form>
      <div>
        <button @click="handleResetPassword">Reset password</button>
        <button @click="handleDeleteUser">Delete user</button>
      </div>
    </section>
    <section class="orders">
      <OrderList :uid="user.uid" />
    </section>
    <section class="offers">
      <OfferList :uid="user.uid" />
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'
import OrderList from './order/OrderList.vue'
import OfferList from './offer/OfferList.vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import useNotification from '@/composables/utils/useNotification'
import redirectToPageWithMessage from '@/composables/utils/redirectToPageWithMessage'
import { useRouter } from 'vue-router'

export default {
  components: { OrderList, OfferList },
  props: { user: Object },
  setup(props) {
    const newEmail = ref('')

    const functions = getFunctions()

    const router = useRouter()

    const handleResetEmail = async () => {
      const resetEmail = httpsCallable(functions, 'manageUser-resetEmail')
      try {
        await resetEmail({ uid: props.user.uid, email: newEmail.value })
        redirectToPageWithMessage(router, 'admin', `Email set to ${newEmail.value}.`, 'success')
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleDeleteUser = async () => {
      const deleteUser = httpsCallable(functions, 'manageUser-deleteUser')
      try {
        await deleteUser({ uid: props.user.uid })
        redirectToPageWithMessage(router, 'admin', 'User deleted.', 'success')
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    const handleResetPassword = async () => {
      try {
        await sendUserPasswordResetEmail(props.user.uid)
        redirectToPageWithMessage(router, 'admin', 'Password reset email sent.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }
    }

    return {
      newEmail, handleResetEmail, handleDeleteUser, handleResetPassword
    }
  }
}
</script>

<style scoped>
.user {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  background-color: #f5f5f5;
  border-radius: 25px;
  width: 100%;
}

.credentials div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
}
</style>