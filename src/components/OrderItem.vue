<template>
  <div class="card" @click="click">
    <img :src="imageSource" :alt="order.book.title">
    <div class="book">
      <h2>{{ order.book.title }}</h2>
      <h3>{{ authors }}</h3>
    </div>
    <div class="details">
      <h3 class="price"><pre>{{ order.offer.price }}  €</pre></h3>
      <p class="condition">{{ order.offer.condition }}</p>
    </div>

  </div>
</template>
  
<script>
import { shoppingCart } from '@/composables/shoppingCart';
import useGetBookIcon from '@/composables/useGetBookIcon'
import { computed } from 'vue'

export default {
  emits: ['orderClicked'],
  props: { order: Object },
  setup(props, { emit }) {
    const { imageSource, getBookIcon } = useGetBookIcon();
      
    const authors = computed(() => {
        return props.order.book.authors.join(', ');
    });

    getBookIcon(props.order.book.imageURL);

    const click = () => {
      emit('orderClicked', props.order)
    }

    return { authors, imageSource, click };
  },
}
</script>

<style scoped>
.card {
  align-items: center;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  width: 90%;
  background-color: #e8e5e5;
  border-radius: 25px;
  justify-content: space-around;
  margin: 20px auto;
}

.card:hover {
  background-color: #dcdcdc;
  cursor: pointer;
}

img {
  margin: 10px auto;
  height: 150px;
}

.price {
  margin: 0;
  font-weight: 800;
  font-size: x-large;
  color: var(--dark-green);
}

.book {
  flex-basis: 50%;
}

.condition {
  margin: auto 5px;
  align-items: center;
  display: flex;
  flex-flow: column;
  row-gap: 10px;
  text-transform: uppercase;
  font-size: larger;
  font-weight: 500;
}

.details {
  flex-basis: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

p {
  margin: 0px;
}

.sold {
  background-color: var(--light-green);
}

</style>