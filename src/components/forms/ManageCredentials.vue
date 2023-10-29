<template>
  <h2>Reset email</h2>
  <form @submit.prevent="">
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
  <p class="error">{{ error }}</p>
</template>

<script>
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { ref } from 'vue'

import useNotification from '@/composables/utils/useNotification'

export default {
  setup() {
    const auth = getAuth()

    const { showNotification, notificationMessage, notificationType, toggleNotification } = useNotification()

    const password = ref('')
    const passwordEmail = ref('')
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

    const handleResetPassword = async () => {
      if (newPassword.value !== newPasswordAgain.value) {
        error.value = 'Passwords do not match.'
      }

      reauthenticateUser(password.value)

      try {
        await updatePassword(auth.currentUser, newPassword.value)
        toggleNotification('Password reset.', 'success', 2000)
      } catch (err) {
        error.value = err.message
      }
    }

    return { password, passwordEmail, newPassword, newPasswordAgain, error, showNotification, notificationMessage, notificationType, handleResetPassword }
  }
}
</script>