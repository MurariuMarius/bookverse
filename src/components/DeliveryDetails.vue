<template>
  <form @submit.prevent="" @mouseleave="sendForm">
    <input type="text" placeholder="Full name" required v-model="name">
    <input type="text" placeholder="Phone number" required v-model="phone" @blur="isValidPhone">
    <textarea type="text" placeholder="Delivery address" required v-model="address"></textarea>
  </form>
  <p class="error" v-if="phoneError">{{ phoneError }}</p>
</template>

<script>
import { onMounted, ref } from 'vue'
import getUser from '@/composables/getUser'
import { firestoreService } from '@/firebase/config'

export default {
  emits: ['sentData'],
  setup(_, { emit }) {
    const { user } = getUser()

    const name = ref('')
    const phone = ref('')
    const address = ref('')

    const phoneError = ref('')
    const noStoredUserData = ref(true)
    
    onMounted(async () => {
      const userData = (await firestoreService.collection('users').doc(user.value.uid).get()).data()
      if (userData.name) {
        name.value = userData.name
        phone.value = userData.phone
        address.value = userData.address
        noStoredUserData.value = false
      }
      sendForm()
    })

    const isValidPhone = () => {
      if (!/^[\+0][0-9]{6,15}$/.test(phone.value)) {
        phoneError.value = 'Invalid phone number'
        return false
      }
      phoneError.value = ''
      return true
    }

    const sendForm = () => {
      if (isValidPhone()) {
        emit('sentData', {
          name: name.value,
          phone: phone.value,
          address: address.value,
          noStoredUserData: noStoredUserData.value,
          phoneError: phoneError.value
        })
      }
    }

    return { name, phone, address, phoneError, noStoredUserData, isValidPhone, sendForm }
  }
}
</script>

<style>
textarea {
  width: 90%;
  margin: 10px auto;
  padding: 10px;
}
</style>