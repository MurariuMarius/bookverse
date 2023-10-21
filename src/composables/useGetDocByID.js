import { firestoreService } from "@/firebase/config"
import { ref } from "vue"

const error = ref('')

const getDocByID = async (collection, ID) => {
  const res = await firestoreService
    .collection(collection)
    .doc(ID)
    .get()
    .then(doc => {
      if (doc.exists) {
        return doc.data()
      } else {
        error.value = 'Document not found'
        return null;
      }
    })
    .catch(err => {
      error.value = 'Error getting document' + err.value
    })

  return res;
}

const useGetDocByID = () => {
  return { error, getDocByID }
}

export default useGetDocByID