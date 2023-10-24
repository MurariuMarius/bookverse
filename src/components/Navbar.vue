<template>
  {{ shoppingCart.getOrderCount() }}
  <div v-if="showShoppingCart" class="background">
    <div class="center">
      <p class="close" @click="toggleShoppingCart">X</p>
      <Order v-for="order in orders" :key="order" :order="order"/>
      SHOPPING CART
    </div>
  </div>
  <nav>
    <div class="menu">
      <div v-if="user">
        <img src="@/assets/shopping-cart.svg" alt="shopping-cart" class="shopping-cart" @click="toggleShoppingCart">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import useSignout from '@/composables/useSignout'
import getUser from '@/composables/getUser'
import Order from '@/components/Order.vue'

import { shoppingCart } from '@/composables/shoppingCart'

export default {
  components: { Order },
  setup() {
    const router = useRouter()
    const { user } = getUser()

    const { error, signout } = useSignout()

    const showShoppingCart = ref(false)
    const orders = ref()

    const handleSignout = async () => {
      await signout()
    }

    const handleLogin = () => {
      router.push({ name: 'login' })
    }

    const goToProfile = () => {
      router.push({ name: 'profile' })
    }

    const toggleShoppingCart = () => {
      if (!showShoppingCart.value) {
        orders.value = shoppingCart.getOrders()
      }
      showShoppingCart.value = !showShoppingCart.value
    }

    return { shoppingCart, showShoppingCart, orders, user, goToProfile, handleLogin, handleSignout, toggleShoppingCart }
  }
}
</script>

<style scoped>
.menu {
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

.shopping-cart
 {
  height: 50px;
  margin-right: 15px;
}

.shopping-cart:hover {
  cursor: pointer;
}

.center {
  margin: 30px auto;
  max-width: 1000px;
  width: 90%;
  background-color: white;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
}
.close {
  align-self: flex-end;
  margin: 25px 25px 0 0;
}

.close:hover {
  cursor: pointer;
}

</style>