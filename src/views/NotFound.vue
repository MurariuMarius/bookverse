<template>
  <div class="image"></div>
  <div class="not-found">
    <h1>WHOOPS!</h1>
    <h2>404: It looks like you're lost... ☹️</h2>
    <h4 @click="goToHomepage">Go to homepage</h4>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const goToHomepage = () => {
      router.push({ name: 'home' })
    }

    return { goToHomepage }
  }
}
</script>

<style>
.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  filter: blur(8px);
  background-size: cover;
  background-image: url('https://i0.wp.com/css-tricks.com/wp-content/uploads/2022/05/toc-photo-scaled.jpg?fit=2560%2C1732&ssl=1');
  background-repeat: no-repeat;
}

.not-found {
  font-size: xx-large;
  color: rgb(247, 247, 247);
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h4 {
  font-weight: 300;
}

h4:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>