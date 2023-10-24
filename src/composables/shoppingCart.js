import { reactive } from "vue"

export const shoppingCart = reactive({
  orders: [],
  addOrder(order) {
    this.orders.push(order)
  },
  getOrderCount() {
    return this.orders.length
  },
  setOrders(orders) {
    if (orders != null) {
      this.orders = orders
    } else {
      this.empty()
    }
  },
  getOrders() {
    return this.orders
  },
  empty() {
    this.orders = []
  }
})