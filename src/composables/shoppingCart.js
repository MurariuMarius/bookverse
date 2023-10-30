import { reactive } from "vue"

const shoppingCart = reactive({
  orders: [],
  addOrder(order) {
    if (this.orders.map(o => o.offer.id).includes(order.offer.id)) {
      return
    }
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
  },
  removeOrder(order) {
    this.orders = this.orders.reduce(
      (acc, el) => {
        if (el == order && !acc.foundFirst) {
          acc.foundFirst = true
        } else {
          acc.orders.push(el)
        }
        return acc
      },
      { orders: [], foundFirst: false }
    ).orders
  }
})
export { shoppingCart }