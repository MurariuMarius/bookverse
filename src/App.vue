<template>
  <Navbar />
  <main class="container">
    <router-view/>
  </main>
  <Footer />
</template>

<script>
import { onMounted } from 'vue'
import { shoppingCart } from './composables/shoppingCart'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: { Footer, Navbar },
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
