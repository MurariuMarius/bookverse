<template>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { shoppingCart } from './composables/shoppingCart'

export default {
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
