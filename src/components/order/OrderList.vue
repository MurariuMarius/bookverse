<template>
  <div v-if="orders && orders.size != 0" class="orderList">
    <Order v-for="[order, orderItems] in orders" :key="order" :order="order" :orderItems="orderItems"
      @loaded="pageLoaded" />
  </div>
  <p v-else>{{ uid }} has placed no orders.</p>
</template>

<script>
import useGetOrdersForUserByID from '@/composables/services/useGetOrdersForUserByID'
import Order from './Order.vue'
import { onMounted, ref } from 'vue'

export default {
  components: { Order },
  props: { uid: String },
  setup(props) {
    const { error, getOrdersForUserByID } = useGetOrdersForUserByID()

    const orders = ref(new Map())
    const showOrders = ref(false)

    onMounted(async () => {
      orders.value = await getOrdersForUserByID(props.uid)
      console.log(props.uid)
      console.log(orders.value)
    })

    const pageLoaded = () => {
      showOrders.value = true
    }

    return { orders, showOrders, pageLoaded }
  }
}
</script>

<style scoped>
.orderList {
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}
</style>