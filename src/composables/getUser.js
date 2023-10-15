import { authService } from "@/firebase/config";
import { ref } from "vue";

const user = ref(authService.currentUser)

authService.onAuthStateChanged(u => {
  user.value = u
})

const getUser = () => {
  return { user }
}

export default getUser