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
        <form @submit.prevent="">
          <input type="text" placeholder="Full name" required v-model="name">
          <input type="text" placeholder="Phone number" required v-model="phone" @blur="isValidPhone">
          <textarea type="text" placeholder="Delivery address" required v-model="address"></textarea>
        </form>
        <p class="error" v-if="phoneError">{{ phoneError }}</p>
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
import { onMounted, ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'

import { shoppingCart } from '@/composables/shoppingCart'
import redirectToPageWithMessage from '@/composables/redirectToPageWithMessage'
import { useRouter } from 'vue-router'
import getUser from '@/composables/getUser'
import { firestoreService } from '@/firebase/config'

export default {
  setup() {
    const functions = getFunctions()

    const orders = ref(shoppingCart.getOrders())

    const name = ref('')
    const phone = ref('')
    const address = ref('')
    
    const phoneError = ref('')
    const agreedTermsOfServiceError = ref('')

    const agreedTermsOfService = ref(false)
    const saveDeliveryDetails = ref(false)
    const noStoredUserData = ref(true)

    const router = useRouter()

    const { user } = getUser()

    onMounted(async () => {
      const userData = (await firestoreService.collection('users').doc(user.value.uid).get()).data()
      if (userData.name) {
        name.value = userData.name
        phone.value = userData.phone
        address.value = userData.address
        noStoredUserData.value = false
      }
    })
    
    const total = ref(orders.value
        .map(o => o.offer.price)
        .reduce((acc, el) => acc += parseFloat(el), 0)
        .toFixed(2)
    )

    const isValidPhone = () => {
      if (!/^[\+0][0-9]{6,15}$/.test(phone.value)) {
        phoneError.value = 'Invalid phone number'
        return false
      }
      phoneError.value = ''
      return true
    }

    const placeOrder = async () => {
      if (!isValidPhone() || !name.value || !address.value) {
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
          name: name.value,
          totalAmount: total.value,
          phone: phone.value,
          address: address.value,
          saveDeliveryDetails: saveDeliveryDetails.value 
        })
        shoppingCart.empty()
        redirectToPageWithMessage(router, 'profile', 'Ordered placed successfully.', 'success')
      } catch (err) {
        console.log(err.message);
        redirectToPageWithMessage(router, 'profile', 'Server error' + err.message, 'error')
      }
    }

    return { address, name, orders, phone, phoneError, noStoredUserData, total, agreedTermsOfService, agreedTermsOfServiceError, saveDeliveryDetails, isValidPhone, placeOrder }
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