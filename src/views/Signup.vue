<template>
  <div>
    <h2>Sign up</h2>
    <form>
      <input type="text" required placeholder="Username" v-model="username">
      <input type="email" required placeholder="Email" v-model="email">
      <input type="password" required placeholder="Password" v-model="password">
      <button>Sign up</button>
    </form>
    <div>
      Already have an account? <span>Sign in</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {

    const username = ref('')
    const email = ref('')
    const password = ref('')

    return { email, password, username }
  }
}
</script>

<style></style>