<template>
  <div class="notification" :class="type">
    <p>{{ message }}</p>
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
  background-color: var(--dark-green);
}

.error {
  background-color: var(--error-red);
}
</style>