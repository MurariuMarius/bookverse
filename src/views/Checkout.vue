<template>
  <h1>Checkout</h1>
  <div class="checkout">
    <section class="cart">
      <h3>Your shopping cart:</h3>
      <div class="orders" v-for="order in orders" :key="order">
        <p>{{ order.book.title }}</p>
        <p>{{ order.offer.price }} €</p>
      </div>
      <h3 class="total">Total: {{ total }} €</h3>
    </section>
    <section class="delivery">
      <section class="delivery-details">
        <h3>Delivery details:</h3>
        <DeliveryDetails @sentData="getDeliveryDetails"/>
        <span v-if="noStoredUserData">
          <input type="checkbox" class="checkbox" v-model="saveDeliveryDetails">
          <label>Save delivery details to my account.</label>
        </span>
      </section>
      <section class="place-order">
        <p>Payment by cash or card on delivery.</p>
        <p class="error" v-if="agreedTermsOfServiceError">{{ agreedTermsOfServiceError }}</p>
        <span>
          <input type="checkbox" class="checkbox" v-model="agreedTermsOfService">
          <label for="checkbox">I have read and agree to the terms of service.</label>
        </span>
        <button @click="placeOrder">Place order</button>
      </section>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getFunctions, httpsCallable } from 'firebase/functions'

import { shoppingCart } from '@/composables/shoppingCart'
import redirectToPageWithMessage from '@/composables/utils/redirectToPageWithMessage'

import DeliveryDetails from '@/components/forms/DeliveryDetails.vue'

export default {
  components: { DeliveryDetails },
  setup() {
    const functions = getFunctions()

    const orders = ref(shoppingCart.getOrders())

    const agreedTermsOfServiceError = ref('')

    const agreedTermsOfService = ref(false)
    const saveDeliveryDetails = ref(false)
    const noStoredUserData = ref(true)

    const router = useRouter()

    let deliveryDetails = null

    const total = ref(orders.value
        .map(o => o.offer.price)
        .reduce((acc, el) => acc += parseFloat(el), 0)
        .toFixed(2)
    )

    const getDeliveryDetails = (details) => {
      console.log(details);
      deliveryDetails = details
      noStoredUserData.value = details.noStoredUserData
    }

    const placeOrder = async () => {
      if (!deliveryDetails || !deliveryDetails.name || !deliveryDetails.address || deliveryDetails.phoneError) {
        return
      }
      
      if (!agreedTermsOfService.value) {
        agreedTermsOfServiceError.value = 'You must agree to the terms of service'
        return
      }

      const createOrder = httpsCallable(functions, 'createOrder')
      try {
        await createOrder({
          items: orders.value,
          name: deliveryDetails.name,
          totalAmount: total.value,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          saveDeliveryDetails: saveDeliveryDetails.value 
        })
        shoppingCart.empty()
        redirectToPageWithMessage(router, 'profile', 'Ordered placed successfully.', 'success')
      } catch (err) {
        console.log(err.message);
        redirectToPageWithMessage(router, 'profile', 'Server error' + err.message, 'error')
      }
    }

    return { orders, noStoredUserData, total, agreedTermsOfService, agreedTermsOfServiceError, saveDeliveryDetails, getDeliveryDetails, placeOrder }
  }
}
</script>

<style scoped>
.checkout {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: var(--x-light-green);
  border-radius: 25px;
  row-gap: 25px;
}

.delivery {
  display: flex;
  flex-direction: column;
  flex-grow: 0.4;
  justify-content: space-between;
}

.delivery-details {
  display: flex;
  flex-direction: column;
}

.cart {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 0.3;
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
  margin: 0;
}

.place-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.checkbox {
  width: auto;
  margin: auto 5px;
}

button {
  background-color: var(--dark-green);
}

button:hover {
  cursor: pointer;
  background-color: var(--x-dark-green);
}

textarea {
  width: 90%;
  margin: 10px auto;
  padding: 10px;
}
</style>