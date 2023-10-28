import { getFunctions, httpsCallable } from 'firebase/functions'
import { ref } from 'vue'

const name = ref('')
const phone = ref('')
const address = ref('')

const phoneError = ref('')

const functions = getFunctions()

const initializeFields = (order) => {
  name.value = order.name
  phone.value = order.phone
  address.value = order.address
}

const changeDeliveryDetails = async (collection, id, ownerIDField) => {
  const isValidPhone = () => {
    if (!/^[\+0][0-9]{6,15}$/.test(phone.value)) {
      phoneError.value = 'Invalid phone number'
      return false
    }
    phoneError.value = ''
    return true
  }

  if (!isValidPhone() || !name.value || !address.value) {
    return
  }

  const changeDeliveryDetailsCloud = httpsCallable(functions, 'changeDeliveryDetails')

  await changeDeliveryDetailsCloud({collection, id, name: name.value, address: address.value, phone: phone.value, ownerIDField})
}

const useChangeDeliveryDetails = () => {
  return { name, address, phone, phoneError, changeDeliveryDetails, initializeFields }
}

export default useChangeDeliveryDetails