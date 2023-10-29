<template>
  {{ order.id }}
  {{ order.totalAmount }}
  <div v-if="showItems">
    <OrderItem v-for="orderItem in orderItems" :key="orderItem" :order="orderItem" />
  </div>
</template>

<script>
import OrderItem from '@/components/OrderItem.vue'
import { ref } from 'vue'

export default {
  components: { OrderItem },
  emits: ['loaded'],
  props: ['order', 'orderItems'],
  setup(props, { emit }) {
    const showItems = ref(false)
    setTimeout(() => {
      showItems.value = true
      emit('loaded')
    }, 300)

    return { showItems }
  }
}
</script>

<style>

</style>