import { firestoreService } from "@/firebase/config"
import { ref } from "vue";

const error = ref('')

const getOffersForBook = async (ISBN) => {
  const offers = []
  console.log('Searching for ' + ISBN);
  const snapshot = await firestoreService.collection('offers')
    .where('ISBN', '==', ISBN)
    .where('status', '==', 'available')
    .get()
  snapshot.forEach(doc => offers.push({...doc.data(), id: doc.id}))
  return offers
}

const useGetOffersForBook = () => {
  return { error, getOffersForBook }
}

export default useGetOffersForBook