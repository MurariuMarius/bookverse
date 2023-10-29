import { authService } from "@/firebase/config";
import { ref } from "vue";

const error = ref(null)

const signout = async () => {
  try {
    await authService.signOut()
    error.value = null
  } catch (err) {
    error.value = err.message
  }
}

const useSignout = () => {
  return { error, signout }
}

export default useSignout