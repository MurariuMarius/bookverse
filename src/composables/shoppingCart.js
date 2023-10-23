import { reactive } from "vue"

export const shoppingCart = reactive({
  orders: [],
  addOrder(order) {
    this.orders.push(order)
  },
  getOrderCount() {
    return this.orders.length
  },
})