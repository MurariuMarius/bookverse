<template>
  <div ref="notification" class="notification-container">
    <div  v-if="message" class="notification" :class="type" >
      <p >{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  props: { message: String, type: String },
  setup(props) {
    const notification = ref(null)

    onMounted(() => {
      notification.value.style.setProperty("margin-top", `-${notification.value.clientHeight}px`) 
    })

    return { notification }
  }
}
</script>

<style scoped>
.notification-container {
  position: sticky;
  top: 30px;
  left: 0vw;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification {
  border-radius: 25px;
  padding: 0 3%;
  margin: 0 5%;
  color: white;
}

.success {
  background-color: #3f9a57;
}

.error {
  background-color: var(--error-red);
}
</style>