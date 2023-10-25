<template>
  <div class="shopping-cart">
    SHOPPING CART
    <Order v-for="order in orders" :key="order" :order="order" />
    <p v-if="!orders.length">No books added.</p>
  </div>
</template>

<script>
import Order from '@/components/Order.vue'

import { shoppingCart } from '@/composables/shoppingCart'
import { ref } from 'vue'

export default {
  components: { Order },
  setup() {
    const orders = ref(shoppingCart.getOrders())
    return { orders }
  }
}
</script>

<style scoped>
.shopping-cart {
  margin: 30px auto;
  max-width: 1000px;
  width: 90%;
  background-color: var(--light-green);
  border-radius: 25px;
  display: flex;
  flex-direction: column;
}
</style>