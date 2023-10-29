import { ref } from 'vue'

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')

const toggleNotification = (message, type, timeVisible) => {
  showNotification.value = true
  notificationMessage.value = message
  notificationType.value = type
  setTimeout(() => {
    showNotification.value = false
  }, timeVisible)
}

const useNotification = () => {
  return { showNotification, notificationMessage, notificationType, toggleNotification }
}

export default useNotification