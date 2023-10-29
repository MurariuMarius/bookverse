import { getFunctions, httpsCallable } from 'firebase/functions'
import { ref } from 'vue'

const bookCondition = ref('')
const price = ref('')
const priceError = ref('')

const functions = getFunctions()

const initializeFields = (offer) => {
  bookCondition.value = offer.condition
  price.value = `${offer.price}`
}

const updateOffer = async (offer) => {
  if (!priceError.value) {        
    const updateOfferCloud = httpsCallable(functions, 'updateOffer')
    const updatedOffer = {...offer, price: price.value, condition: bookCondition.value }
    await updateOfferCloud({offer: updatedOffer})
  }
}

const deleteOffer = async (offer) => {
  const deleteOfferCloud = httpsCallable(functions, 'deleteOffer')
  await deleteOfferCloud({ offer })
}

const useManageOffer = () => {
  return { bookCondition, price, priceError, initializeFields, updateOffer, deleteOffer }
}

export default useManageOffer