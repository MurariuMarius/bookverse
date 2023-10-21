<template>
  <div class="book">
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
        <BookConditionsDescription />
      </div>
    </div>
  </div>
</template>

<script>
import BookConditionsDescription from './BookConditionsDescription.vue';
import Offer from './Offer.vue';


export default {
  components: { BookConditionsDescription, Offer, BookConditionsDescription },
  props: { book: Object, offers: Array[Object], imageSource: String },
  setup(props) {
    console.log(props.book);
    console.log(props.offers);
  }
}
</script>

<style scoped>
.book {
  margin: 20px auto;
  background-color: rgb(231, 253, 234);
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-flow: column;
}

.headSection {
  margin: 5% auto;
  display: flex;
  width: 100%;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.bookDetails {
  justify-content: center;
  display: flex;
  flex-flow: column;
}

.offers {
  margin: auto 3%;
  display: flex;
  flex-flow: column;
}

.offers h3 {
  font-weight: 600;
  align-self: flex-start;
}

img {
  margin: auto;
  height: 500px;
  max-width: 90%;
}
</style>