import { authService } from "@/firebase/config";
import { ref } from "vue";

const error = ref(null)

const signup = async (email, password) => {
  try {
    const res = await authService.createUserWithEmailAndPassword(email, password)
    console.log(res);
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