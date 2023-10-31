<template>
  <div class="login">
    <h2>Sign up</h2>
    <form @submit.prevent="handleSubmit" >
      <input type="text" required placeholder="Username" v-model="username">
      <input type="email" required placeholder="Email" v-model="email">
      <input type="password" required placeholder="Password" v-model="password">
      <input type="password" required placeholder="Password again" v-model="passwordAgain">
      <button>Sign up</button>
    </form>
    <div>
      Already have an account? <span class="link" @click="redirectLogin">Log in</span>
    </div>
    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import useSignup from '@/composables/auth/useSignup'
import { Timestamp } from '@/firebase/config'
import { firestoreService } from '@/firebase/config'

export default {
  setup() {

    const username = ref('')
    const email = ref('')
    const password = ref('')
    const passwordAgain = ref('')

    const { error, signup } = useSignup()

    const router = useRouter()

    const verifyMatchingPasswords = () => {
      if (password.value !== passwordAgain.value) {
        error.value = 'Passwords do not match'
        return false;
      }
      return true;
    }

    const redirectLogin = () => {
      router.push({ name: 'login' })
    }

    const handleSubmit = async () => {
      if (verifyMatchingPasswords()) {
        const res = await signup(email.value, password.value, username.value)
        firestoreService.collection('users')
          .doc(res.user.uid)
          .set({
            username: username.value,
            email: email.value,
            createdAt: Timestamp.now()
        })
        if (!error.value) {
          router.push({ name: 'home' })
          router.go()
        }
      }
    }

    return { email, error, password, passwordAgain, username, handleSubmit, redirectLogin }
  }
}
</script>