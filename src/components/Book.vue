<template>
  <div class="book">
    BOOK
    <div class="headSection">
      <div class="bookDetails">
        <img :src="imageSource" :alt="book.title">
        <h2>{{ book.title }}</h2>
        <h2>{{ book.authors }}</h2>
        <h3>{{ book.ISBN }}</h3>
      </div>
      <div class="offers">
        <h3>Available offers:</h3>
        <Offer v-for="offer in offers" :offer="offer" />
      </div>
    </div>
  </div>
</template>

<script>
import Offer from './Offer.vue';

export default {
  components: { Offer },
  props: { book: Object, offers: Array[Object], imageSource: String },
  setup(props) {
    console.log(props.book);
    console.log(props.offers);
  }
}
</script>

<style scoped>
.book {
  background-color: antiquewhite;
  width: 77%;
  display: flex;
  flex-flow: column;
}

.headSection {
  display: inline-flex;
  width: 100%;
}

.bookDetails {
  justify-content: center;
  display: flex;
  flex-flow: column;
  width: 60%;
}

.offers {
  display: flex;
  flex-flow: column;
  width: 40%;
}

.offers h3 {
  font-weight: 600;
  align-self: flex-start;
}

img {
  margin: auto;
  height: 500px;
  /* max-width: 90%; */
}
</style>