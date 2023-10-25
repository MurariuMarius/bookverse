<template>
  <div class="shopping-cart">
    <h3>SHOPPING CART</h3>
    <p v-if="!orders.length">No books added.</p>
    <div v-else class="orders">
      <p>Click on an item to remove it.</p>
      <Order v-for="order in orders" :key="order" :order="order" />
      <h2>Total: {{ total }} €</h2>
    </div>
  </div>
</template>

<script>
import Order from '@/components/Order.vue'

import { shoppingCart } from '@/composables/shoppingCart'
import { computed, ref } from 'vue'

export default {
  components: { Order },
  setup() {
    const orders = computed(() => shoppingCart.getOrders())
    const total = computed(() => {
      return orders.value
        .map(o => o.offer.price)
        .reduce((acc, el) => acc += parseFloat(el), 0)
        .toFixed(2)
    })
    return { orders, total }
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