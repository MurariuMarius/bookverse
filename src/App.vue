<template>
  <Navbar />
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { shoppingCart } from './composables/shoppingCart'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  setup() {
    window.onbeforeunload = () => {
      window.localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart.getOrders()))
    }

    onMounted(() => {
      shoppingCart.setOrders(JSON.parse(window.localStorage.getItem('shoppingCart')))
    })
  }
}
</script>

<style>

</style>
