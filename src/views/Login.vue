<template>
  <div>
    <h2>Log in</h2>
    <form @submit.prevent="handleSubmit">
      <input type="email" required placeholder="Email" v-model="email">
      <input type="password" required placeholder="Password" v-model="password">
      <button>Log in</button>
    </form>
    <div>
      Not yet registered? <span @click="redirectSignup">Sign up</span>
    </div>
    <div class="error">{{ error }}</div>
  </div>
</template>
  
<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import useLogin from '@/composables/useLogin'

export default {
  setup() {
    const email = ref('')
    const password = ref('')

    const router = useRouter()
    const { error, login } = useLogin()

    const redirectSignup = () => {
      router.push({ name: 'signup'})
    }

    const handleSubmit = async () => {
      await login(email.value, password.value)
      if (!error.value) {
        router.push({ name: 'home' })
      }
    }

    return { email, error, password, handleSubmit, redirectSignup }
  }
}
</script>
  
<style scoped>
div {
  width: 400px;
}

span {
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
}
</style>