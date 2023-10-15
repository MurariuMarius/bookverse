<template>
  <div>
    <h2>Log in</h2>
    <form>
      <input type="email" required placeholder="Email" v-model="email">
      <input type="password" required placeholder="Password" v-model="password">
      <button>Sign up</button>
    </form>
    <div>
      Not yet registered? <span>Sign up</span>
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue'

export default {
  setup() {
    const email = ref('')
    const password = ref('')

    return { email, password }
  }
}
</script>
  
<style></style>