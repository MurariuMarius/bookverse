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
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f9fbf9;
}

.spin {
    position: absolute;
    left: 50vw;
    bottom: 50vh;
    display: block;
    width: 60px;
    height: 60px;
    margin: 30px auto;
    border: 5px solid transparent;
    border-radius: 50%;
    border-top-color: #01bf14;
    animation: spin 1s ease infinite;
  }
  
  @keyframes spin {
  to { transform: rotateZ(360deg)}
  }
</style>