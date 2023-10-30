<template>
  <h2>Reset email</h2>
  <form @submit.prevent="handleResetEmail">
    <input type="email" placeholder="New email" required v-model="email">
    <input type="password" placeholder="Password" required v-model="passwordEmail">
    <button>Reset email</button>
  </form>
  <h2>Reset password</h2>
  <form @submit.prevent="handleResetPassword">
    <input type="password" placeholder="Current password" required v-model="password">
    <input type="password" placeholder="New password" required v-model="newPassword">
    <input type="password" placeholder="New password (again)" required v-model="newPasswordAgain">
    <button>Reset password</button>
  </form>
  <p v-if="error" class="error">{{ error }}</p>
  <h2>Delete account</h2>
  <input type="password" placeholder="Password" required v-model="passwordDeleteAccount">
  <button @click="handleDeleteAccount">Delete account</button>
</template>

<script>
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import useNotification from '@/composables/utils/useNotification'
import { getFunctions, httpsCallable } from 'firebase/functions'

export default {
  setup() {
    const auth = getAuth()

    const functions = getFunctions()

    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const passwordEmail = ref('')
    const passwordDeleteAccount = ref('')
    const newPassword = ref('')
    const newPasswordAgain = ref('')
    const error = ref('')

    const reauthenticateUser = async (password) => {
      await reauthenticateWithCredential(
        auth.currentUser, 
        EmailAuthProvider.credential(
          auth.currentUser.email,
          password
        )
      )
    }
    
    const handleResetEmail = async () => {
      try {
        await reauthenticateUser(passwordEmail.value)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
        return
      }

      const resetEmail = httpsCallable(functions, 'manageUser-resetEmail')

      try {
        await resetEmail({ uid: auth.currentUser.uid, email: email.value })
        toggleNotification('Email reset.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
      }

      passwordEmail.value = email.value = ''
    }

    const handleResetPassword = async () => {
      if (newPassword.value !== newPasswordAgain.value) {
        error.value = 'Passwords do not match.'
        return
      }

      try {
        await reauthenticateUser(password.value)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
        return
      }

      try {
        await updatePassword(auth.currentUser, newPassword.value)
        toggleNotification('Password reset.', 'success', 2000)
      } catch (err) {
        error.value = err.message
        toggleNotification(err.message, 'error', 2000)
      }

      password.value = newPassword.value = newPasswordAgain.value = ''
    }

    const handleDeleteAccount = async () => {
      try {
        await reauthenticateUser(passwordDeleteAccount.value)
      } catch (err) {
        toggleNotification(err.message, 'error', 2000)
        return
      }

      const deleteAccount = httpsCallable(functions, 'manageUser-deleteUser')
      try {
        await deleteAccount({ uid: auth.currentUser.uid })
        toggleNotification('Account deleted.', 'success', 2000)
      } catch (err) {
        toggleNotification(err.message, 'err', 2000)
      }

      passwordDeleteAccount.value = ''
    }

    return {
      email, password, passwordDeleteAccount, passwordEmail, newPassword, newPasswordAgain, error,
      showNotification, notificationMessage, notificationType,
      handleResetEmail, handleResetPassword, handleDeleteAccount
    }
  }
}
</script>

<style scoped>
button {
  margin: 20px auto;
}

input {
  align-self: center;
}
</style>