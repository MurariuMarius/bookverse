import { firestoreService } from "@/firebase/config"
import { ref } from "vue";

const error = ref('')

const getOffersForBook = async (ISBN) => {
  const offers = []
  console.log('Searching for ' + ISBN);
  const snapshot = await firestoreService.collection('offers')
    .where('ISBN', '==', ISBN)
    .get()
  snapshot.forEach(doc => offers.push(doc.data()))
  return offers
}

const useGetOffersForBook = () => {
  return { error, getOffersForBook }
}

export default useGetOffersForBook