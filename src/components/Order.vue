<template>
  <div class="order">
    <section class="general">
      <p>ID: {{ order.id }}</p>
      <h3>Total {{ order.totalAmount }} €</h3>
      <p>Delivered to: 
        <span>
          {{ order.name }} {{ order.address }} {{ order.phone }}
        </span>
      </p>
    </section>
    <section v-if="showItems" class="items">
      <OrderItem v-for="orderItem in orderItems" :key="orderItem" :order="orderItem" @orderClicked="removeOrder"/>
    </section>
    <section class="manage">
      <p v-if="!showManageOrderMenu" @click="toggleManageOrderMenu">Manage order</p>
      <div>
        <h3>Change order delivery</h3>
        <DeliveryDetails :name="order.name" :phone="order.phone" :address="order.address" @sentData="getDeliveryDetails" />
        <button @click="handleChangeDeliveryDetails">Change delivery</button>
        <h3>Removed items</h3>
        <p v-for="item in itemsToBeRemoved">
          {{ item.title }} - {{ item.authors }} - {{ item.price }} €
        </p>
        <p>New total: {{ newTotal }} €</p>
        <button @click="handleRemoveItems">Apply changes</button>
        <button @click="handleDeleteOrder">Delete order</button>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getFunctions, httpsCallable } from 'firebase/functions'

import DeliveryDetails from '@/components/DeliveryDetails.vue'
import OrderItem from '@/components/OrderItem.vue'
import Notification from '@/components/Notification.vue'

import redirectToPageWithMessage from '@/composables/redirectToPageWithMessage'
import useChangeDeliveryDetails from '@/composables/useChangeDeliveryDetails'

export default {
  components: { DeliveryDetails, OrderItem, DeliveryDetails, Notification },
  emits: ['loaded'],
  props: ['order', 'orderItems'],
  setup(props, { emit }) {
    
    const showItems = ref(false)
    setTimeout(() => {
      showItems.value = true
      emit('loaded')
    }, 300)

    const functions = getFunctions()

    const router = useRouter()

    const showManageOrderMenu = ref(false)

    const { name, phone, address, phoneError, changeDeliveryDetails } = useChangeDeliveryDetails()

    const itemsToBeRemoved = ref([])
    const newTotal = ref(parseFloat(props.order.totalAmount))

    const toggleManageOrderMenu = () => {
      showManageOrderMenu.value = !showManageOrderMenu.value
    }

    const removeOrder = (order) => {
      if (!showManageOrderMenu.value || itemsToBeRemoved.value.map(item => item.id).includes(order.offer.id)) {
        return
      }
      
      itemsToBeRemoved.value.push({
        id: order.offer.id,
        title: order.book.title,
        authors: order.book.authors.join(', '),
        price: order.offer.price
      })
      
      newTotal.value = newTotal.value - parseFloat(order.offer.price)
    }

    const getDeliveryDetails = (details) => {
      name.value = details.name
      phone.value = details.phone
      address.value = details.address
    }

    const handleChangeDeliveryDetails = async () => {
      if (phoneError.value) {
        return
      }

      try {
        await changeDeliveryDetails('orders', props.order.id, 'buyerID')
        redirectToPageWithMessage(router, 'profile', 'Successfully changed delivery details.', 'success')
      } catch (err) {
        redirectToPageWithMessage(router, 'profile', err.message, 'error')
      }
    }
    
    const handleRemoveItems = async () => {

      console.log(itemsToBeRemoved.value.length, props.orderItems.length)

      if (itemsToBeRemoved.value.length === props.orderItems.length) {
        await handleDeleteOrder()
        return
      }

      const itemIDs = itemsToBeRemoved.value.map(item => item.id).join(', ') 

      const removeItems = httpsCallable(functions, 'manageOrder-removeItems')
      try {
        await removeItems({ orderID: props.order.id, offerIDs: itemIDs })
        redirectToPageWithMessage(router, 'profile', 'Successfully removed items.', 'success')
      } catch (err) {
        redirectToPageWithMessage(router, 'profile', err.message, 'error')
      }
    }
    
    const handleDeleteOrder = async () => {
      const deleteOrder = httpsCallable(functions, 'manageOrder-deleteOrder')
      try {
        await deleteOrder({ orderID: props.order.id })
        redirectToPageWithMessage(router, 'profile', 'Order deleted.', 'success')
      } catch (err) {
        redirectToPageWithMessage(router, 'profile', err.message, 'error')
      }
    }

    return { itemsToBeRemoved, newTotal, showItems, showManageOrderMenu, getDeliveryDetails, handleChangeDeliveryDetails, handleRemoveItems, handleDeleteOrder, removeOrder, toggleManageOrderMenu }
  }
}
</script>

<style scoped>
.order {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--light-green);
  border-radius: 25px;
  row-gap: 0;
}

.items {
  width: 100%;
}

.general {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.manage > p {
  text-decoration: underline;
}

.manage > p:hover {
  cursor: pointer;
}
</style>