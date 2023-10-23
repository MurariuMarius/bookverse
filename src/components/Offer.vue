<template>
  <ManageOffer v-if="showManageOffer" :offer="offer" :title="book.title" :authors="authors" @close="toggleManageOffer"/>
  <div class="card" :class="offerStatus" @click="toggleManageOffer">
    <img :src="imageSource" :alt="book.title">
    <div class="book">
      <h2>{{ book.title }}</h2>
      <h3>{{ authors }}</h3>
    </div>
    <div class="details">
      <h3 class="price"><pre>{{ offer.price }}  €</pre></h3>
      <p class="condition">{{ offer.condition }}</p>
    </div>

  </div>
</template>

<script>
import useGetBookIcon from '@/composables/useGetBookIcon'
import { computed, ref } from 'vue'

import ManageOffer from './ManageOffer.vue'

export default {
  emits: ['success'],
  props: { book: Object, offer: Object },
  setup(props, { emit }) {
    const { imageSource, getBookIcon } = useGetBookIcon();
    const offerStatus = ref('');
    const showManageOffer = ref(false)

    const authors = computed(() => {
        return props.book.authors.join(', ');
    });

    if (props.offer.status === 'sold') {
        offerStatus.value = 'sold';
    }

    getBookIcon(props.book.imageURL);

    const toggleManageOffer = () => {
      if (props.offer.status !== 'sold') {
        showManageOffer.value = !showManageOffer.value
      }
    }

    return { authors, imageSource, offerStatus, showManageOffer, toggleManageOffer };
  },
  components: { ManageOffer }
}
</script>

<style scoped>
.card {
  align-items: center;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  width: 100%;
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