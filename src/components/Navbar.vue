<template>
  <nav>
    <div class="search">
      
    </div>
    <div class="menu">
      <div v-if="user">
        <h2>{{ user.displayName }}</h2>
        <button @click="handleSignout">Sign out</button>
      </div>
      <div v-else>
        <button @click="handleLogin">Log in</button>
      </div>
    </div>
  </nav>

</template>

<script>
import { useRouter } from 'vue-router'

import useSignout from '@/composables/useSignout'
import getUser from '@/composables/getUser'

export default {
  
  setup() {
    const router = useRouter()
    const { user } = getUser()

    const { error, signout } = useSignout()

    const handleSignout = async () => {
      await signout()
    }

    const handleLogin = () => {
      router.push({ name: 'login' })
    }

    return { user, handleLogin, handleSignout }
  }
}
</script>

<style scoped>
.menu {
  width: 50%;
  margin-right: 0;
}

.menu div {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
}

button {
  margin: 20px;
}

.menu h2 {
  color: #f6f3f3;
  cursor: pointer;
}
nav {
  width: 100%;
  border-radius: 15px;
  background-image: linear-gradient(to bottom right, #69c606, var(--dark-green));
}
</style>