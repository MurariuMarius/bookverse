<template>
  <div>
    <h2>Sign up</h2>
    <form @submit.prevent="handleSubmit" >
      <input type="text" required placeholder="Username" v-model="username">
      <input type="email" required placeholder="Email" v-model="email">
      <input type="password" required placeholder="Password" v-model="password">
      <input type="password" required placeholder="Password again" v-model="passwordAgain">
      <button>Sign up</button>
    </form>
    <div>
      Already have an account? <span>Log in</span>
    </div>
    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useSignup } from '@/composables/useSignup'
import { useRouter } from 'vue-router'

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

    const handleSubmit = async () => {
      if (verifyMatchingPasswords()) {
        await signup(email.value, password.value)
        if (!error.value) {
          router.push({ name: 'home' })
        }
      }
    }

    return { email, error, password, passwordAgain, username, handleSubmit }
  }
}
</script>

<style></style>