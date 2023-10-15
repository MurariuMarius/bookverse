import { ref } from "vue"
import { authService } from "@/firebase/config"

const error = ref(null)

const login = async (email, password) => {
    try {
        const res = await authService.signInWithEmailAndPassword(email, password)
        error.value = null
        return res
    } catch (err) {
        error.value = 'Incorrect login credentials'
    }
}

const useLogin = () => {
    return { error, login };
}

export default useLogin