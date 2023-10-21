<template>
  <div class="card">
    <h3 class="price"><pre>{{ offer.price }}  €</pre></h3>
    <div class="details">
      <p class="condition">{{ offer.condition }}</p>
      <p class="seller">Seller</p>
    </div>
  </div>
</template>

<script>
export default {
  props: { offer: Object },
  setup(props) {

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
}

.price {
  margin: 0;
  font-weight: 800;
  font-size: x-large;
  color: #01bf14;
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

</style>