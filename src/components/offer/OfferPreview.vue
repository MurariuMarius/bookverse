<template>
  <div class="card" @click="offerClicked">
    <h3 class="price"><pre>{{ offer.price }}  €</pre></h3>
    <div class="details">
      <p class="condition">{{ offer.condition }}</p>
      <!-- <p class="seller">{{ offer.sellerID }}</p> -->
    </div>
  </div>
</template>

<script>
import getUser from '@/composables/auth/getUser'

export default {
  props: { offer: Object },
  emits: ['offerSelected'],
  setup(props, { emit }) {

    const { user } = getUser()

    const offerClicked = () => {
      if (user.value != null) {
        console.log('emit');
        emit('offerSelected', props.offer)
      }
    }

    return { offerClicked }
  }
}
</script>

<style scoped>
.card {
  align-items: center;
  display: flex;
  flex-flow: row;
  width: 100%;
  background-color: #e8e5e5;
  border-radius: 25px;
  justify-content: space-around;
}

.card:hover {
  background-color: #dcdcdc;
  cursor: pointer;
}

.price {
  margin: 0;
  font-weight: 800;
  font-size: x-large;
  color: var(--dark-green);
}

.details {
  margin: 0;
  align-items: flex-end;
  display: flex;
  flex-flow: column;
  row-gap: 10px
}

p {
  margin: 0px;
}

.condition {
  text-transform: uppercase;
  font-size: larger;
  font-weight: 500;
}

.seller {
  border-bottom: 1.3px solid;
}

</style>