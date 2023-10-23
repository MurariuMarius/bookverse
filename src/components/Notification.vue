<template>
  <div v-if="showMessage" class="notification" :class="notificationType">
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  props: { route: Object, window: Window },
  setup(props) {

    const router = useRouter()
    const message = ref('')
    const notificationType = ref('')
    const showMessage = ref(false)

    const toggleMessage = () => {
      showMessage.value = true
      setTimeout(() => {
        router.push({ name: props.route.name })
        showMessage.value = false
      }, 2000)
    }

    onMounted(() => {
      if (props.route.query.msg) {
          message.value = props.route.query.msg
          notificationType.value = props.route.query.t
          setTimeout(() => {
            props.window.scrollTo({
              top: parseInt(props.route.query.s),
              left: 0,
              behavior: 'smooth'
            })
          }, 500)
          toggleMessage()
      }
    })

    return { message, showMessage, notificationType }
  }
}
</script>

<style scoped>
.notification {
  position: sticky;
  top: 40px;
  left: 50vw;
  transform: translateX(-50%);
  width: 20%;
  min-width: 300px;
  display: flex;
  justify-content: center;
  border-radius: 25px;
  color: white;
}

.success {
  background-color: var(--dark-green);
}
</style>