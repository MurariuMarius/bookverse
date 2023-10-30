<template>
  <nav>
    <img class="logo" src="@/assets/logo.png" alt="logo" @click="goToHomePage">
    <div v-if="user">
      <div class="shopping-cart">
        <p v-show="shoppingCartItemCount" >{{ shoppingCartItemCount }}</p>
        <img src="@/assets/shopping-cart.svg" alt="shopping-cart" @click="goToShoppingCart">
      </div>
      <h2 class="user" @click="goToProfile">{{ user.displayName }}</h2>
      <button @click="handleSignout">Sign out</button>
    </div>
    <div v-else>
      <button @click="handleLogin">Log in</button>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'

import useSignout from '@/composables/auth/useSignout'
import getUser from '@/composables/auth/getUser'

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
      shoppingCart.empty()
      router.push({ name: 'home' })
      await signout()
    }

    const handleLogin = () => {
      router.push({ name: 'login' })
    }

    const goToHomePage = () => {
      router.push({ name: 'home' })
    }

    const goToProfile = () => {
      router.push({ name: 'profile' })
    }

    const goToShoppingCart = () => {
      router.push({ name: 'shoppingCart' })
    }

    return { shoppingCart, user, shoppingCartItemCount, goToHomePage, goToProfile, handleLogin, handleSignout, goToShoppingCart }
  }
}
</script>

<style scoped>
nav {
  padding: 20px 5%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  background-image: linear-gradient(to bottom right, #69c606, var(--dark-green));
  row-gap: 25px;
  column-gap: 30%;
}

.logo {
  width: 300px;
  cursor: pointer;
}

nav > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  column-gap: 15px;
}

.user {
  color: #f6f3f3;
  cursor: pointer;
}

.shopping-cart {
  position: relative;
  margin: 0;
}

.shopping-cart img {
  height: 50px;
  margin: 0;
}

.shopping-cart img:hover {
  cursor: pointer;
}

.shopping-cart p {
  background-color: #ff3232;
  color: rgb(230, 230, 230);
  border-radius: 50%;
  padding-left: 19%;
  padding-right: 19%;
  position: absolute;
  top: -40%;
  left: 80%;
}

</style>