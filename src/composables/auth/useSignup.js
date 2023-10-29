import { authService } from "@/firebase/config";
import { ref } from "vue";

const error = ref(null)

const signup = async (email, password, displayName) => {
  try {
    const res = await authService.createUserWithEmailAndPassword(email, password)
    await res.user.updateProfile({ displayName })
    error.value = null
    return res
  } catch (err) {
    error.value = err.message
  }
}

const useSignup = () => {
  return { error, signup }
}

export default useSignup