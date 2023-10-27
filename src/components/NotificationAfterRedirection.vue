<template>
  <Notification v-if="showNotification" :message="message" :type="notificationType" />
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import Notification from '@/components/Notification.vue'

export default {
  components: { Notification },
  props: { route: Object, window: Window },
  setup(props) {

    const router = useRouter()
    const message = ref('')
    const notificationType = ref('')
    const showNotification = ref(false)

    const toggleMessage = () => {
      showNotification.value = true
      setTimeout(() => {
        router.push({ name: props.route.name })
        showNotification.value = false
      }, 2000)
    }

    onMounted(() => {
      if (props.route.query.msg) {
          message.value = props.route.query.msg
          notificationType.value = props.route.query.t
          if (props.window) {
            setTimeout(() => {
              props.window.scrollTo({
                top: parseInt(props.route.query.s),
                left: 0,
                behavior: 'smooth'
              })
            }, 500)
          }
          toggleMessage()
      }
    })

    return { message, showNotification, notificationType }
  }
}
</script>

<style>

</style>