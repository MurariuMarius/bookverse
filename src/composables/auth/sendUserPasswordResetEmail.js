import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { firestoreService } from '@/firebase/config'

const sendUserPasswordResetEmail = async (userID) => {
  const user = (await firestoreService.collection('users').doc(userID).get()).data()

  const auth = getAuth()
  sendPasswordResetEmail(auth, user.email)
}

export default sendUserPasswordResetEmail