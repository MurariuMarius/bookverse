<template>
  CHECKOUT
  <aside>
    <h3>Your shopping cart</h3>
    <div class="orders" v-for="order in orders" :key="order">
      <p>{{ order.book.title }}</p>
      <p>{{ order.offer.price }}</p>
    </div>
    <h3 class="total">Total: {{ total }} €</h3>
  </aside>
</template>

<script>
import { shoppingCart } from '@/composables/shoppingCart';
import { ref } from 'vue';

export default {
  setup() {
    const orders = ref(shoppingCart.getOrders())

    const total = ref(orders.value
        .map(o => o.offer.price)
        .reduce((acc, el) => acc += parseFloat(el), 0)
        .toFixed(2)
    )

    return { orders, total }
  }
}
</script>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.total {
  align-self: flex-end;
}

.orders {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>