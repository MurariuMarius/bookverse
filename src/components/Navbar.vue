<template>
  <nav>
    <div class="menu">
      <div v-if="user">
        <div class="shopping-cart">
          <p v-show="shoppingCartItemCount" >{{ shoppingCartItemCount }}</p>
          <img src="@/assets/shopping-cart.svg" alt="shopping-cart" @click="goToShoppingCart">
        </div>
        <h2 @click="goToProfile">{{ user.displayName }}</h2>
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

import { shoppingCart } from '@/composables/shoppingCart'
import { computed } from 'vue'

export default {
  setup() {
    const router = useRouter()
    const { user } = getUser()

    const { error, signout } = useSignout()

    const shoppingCartItemCount = computed(() => {
      return shoppingCart.getOrderCount()
    })

    const handleSignout = async () => {
      await signout()
    }

    const handleLogin = () => {
      router.push({ name: 'login' })
    }

    const goToProfile = () => {
      router.push({ name: 'profile' })
    }

    const goToShoppingCart = () => {
      router.push({ name: 'shoppingCart' })
    }

    return { shoppingCart, user, shoppingCartItemCount, goToProfile, handleLogin, handleSignout, goToShoppingCart }
  }
}
</script>

<style scoped>
.menu {
  margin-right: 0;
}

.menu > div {
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

.shopping-cart {
  position: relative;
  margin: 0;
}

.shopping-cart img {
  height: 50px;
  margin-right: 15px;
}

.shopping-cart img:hover {
  cursor: pointer;
}

.shopping-cart p {
  background-color: #ff0000;
  border-radius: 50%;
  padding-left: 15%;
  padding-right: 15%;
  position: absolute;
  top: -40%;
  left: 60%;
}

</style>