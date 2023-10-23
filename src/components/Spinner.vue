<template>
  <div class="background">
    <div class="spin"></div>
  </div>
</template>

<script>
export default {
}
</script>

<style>
.background {
  background-color: var(--x-light-green);
}

.spin {
    width: 60px;
    height: 60px;
    margin: auto;
    border: 5px solid transparent;
    border-radius: 50%;
    border-top-color: var(--dark-green);
    animation: spin 1s ease infinite;
  }
  
@keyframes spin {
to { transform: rotateZ(360deg)}
}
</style>