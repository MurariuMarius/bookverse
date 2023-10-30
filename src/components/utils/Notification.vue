<template>
  <div ref="notification" class="notification-container">
    <div  v-if="message" class="notification" :class="type" >
      <p >{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: { message: String, type: String },
  setup(props) {
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
  background-color: var(--dark-green);
}

.error {
  background-color: var(--error-red);
}
</style>