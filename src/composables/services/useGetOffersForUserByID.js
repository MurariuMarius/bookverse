import { firestoreService } from "@/firebase/config"
import { ref } from "vue"
import useGetDocByID from "@/composables/utils/useGetDocByID"

const error = ref('') 

const { getDocByID } = useGetDocByID()

const getOffersForUserByID = async (ID, role) => {
  
  if (role !== 'seller' && role !== 'buyer') {
    throw new Error('Invalid role')
  }

  const offers = []
  
  const offerSnapshot = await firestoreService.collection('offers')
    .where(role === 'seller' ? 'sellerID' : 'buyerID', '==', ID)
    .get()
  offerSnapshot.forEach(doc => offers.push({...doc.data(), id: doc.id}))
  
  
  const offersBookMap = new Map();
  
  if (offers.length == 0) {
    error.value = 'No items found'
    return offersBookMap;
  }

  await Promise.all(
    offers.map(async (offer) => {
      const book = await getDocByID('books', offer.ISBN)
      offersBookMap.set(offer, book)
    })
  )

  return offersBookMap;
}

const useGetOffersForUserByID = () => {
  return { error, getOffersForUserByID }
}

export default useGetOffersForUserByID