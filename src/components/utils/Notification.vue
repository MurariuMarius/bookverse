<template>
  <div ref="notification" v-if="message" class="notification" :class="type" >
    <p >{{ message }}</p>
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
.notification {
  position: sticky;
  top: 40px;
  left: 50vw;
  transform: translateX(-50%);
  width: 30%;
  min-width: 300px;
  display: flex;
  justify-content: center;
  border-radius: 25px;
  color: white;
}

.success {
  background-color: #3f9a57;
}

.error {
  background-color: var(--error-red);
}
</style>