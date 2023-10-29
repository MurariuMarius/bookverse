<template>
  <div class="background">
    <div class="center">
      <p class="close" @click="close">X</p>
      <h2>Manage offer</h2>
      <h4><span class="title">{{ title }}</span> - {{ authors }}</h4>      
      <form class="inline" @submit.prevent="">
        <input type="text" @blur="checkPrice" v-model="price">
        <p>EUR</p>
      </form>
      <p v-if="priceError" class="error">{{ priceError }}</p>
      <div class="options">
        <button v-for="option in bookConditions" :key="option" @click="selectOption" :class="{'highlight':  bookCondition === option}">{{ option }}</button>
      </div>
      <div class="inline">
        <button class="update" @click="handleUpdate">Update</button>
        <button class="delete" @click="handleDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'

import redirectToPageWithMessage from '@/composables/utils/redirectToPageWithMessage'
import useManageOffer from '@/composables/services/useManageOffer'

export default {
  emits: [ 'close' ],
  props: { offer: Object, title: String, authors: String },
  setup(props, { emit }) {
    const bookConditions = ref(['New', 'As New', 'Good', 'Fair', 'Poor'])

    const { bookCondition, price, priceError, initializeFields, updateOffer, deleteOffer } = useManageOffer()

    const router = useRouter()

    onMounted(() => {
      initializeFields(props.offer)
    })

    const selectOption = e => {
      bookCondition.value = e.target.innerHTML
    }

    const checkPrice = () => {
      priceError.value = ''
      if (!/^(([1-9][0-9]{0,8})|0)([.,][0-9]{1,2})?$/.test(price.value.trim())) {
        console.log('check price');
        priceError.value = 'Invalid price'
      }
    }

    const close = () => {
      emit('close')
    }

    const handleUpdate = async () => {
      try {
        await updateOffer(props.offer)
        redirectToPageWithMessage(router, 'profile', 'Offer updated successfully.', 'success')
      } catch (err) {
        redirectToPageWithMessage(router, 'profile', 'A server error occurred.' + err.message, 'error')
      }
    }

    const handleDelete = async () => {
      try {
        await deleteOffer(props.offer)
        redirectToPageWithMessage(router, 'profile', 'Offer deleted successfully.', 'success')
      } catch (err) {
        redirectToPageWithMessage(router, 'profile', 'A server error occurred.' + err.message, 'error')
      }
    }

    return { bookConditions, price, priceError, bookCondition, close, checkPrice, handleUpdate, handleDelete, selectOption }
  }
}
</script>

<style scoped>
.close {
  align-self: flex-end;
  margin: 25px 25px 0 0;
}

.close:hover {
  cursor: pointer;
}

h4 {
  font-weight: 400;
  font-size: large;
}

.inline {
  width: 70%;
  max-width: 300px;
  margin: auto;
  display: inline-flex;
  align-items: center;
}

.inline p {
  margin-left: 10px;
}

.center {
  margin: 30px auto;
  max-width: 600px;
  width: 90%;
  background-color: white;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
}
.options {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.options button {
  width: 90px;
  height: 40px;
}
.highlight {
  background-color: #2fc521;
}

button {
  width: 115px;
  height: 50px;
}

.delete {
  background-color: #ff3a3a;
}

.update {
  background-color: var(--dark-green);
}

.delete:hover {
  cursor: pointer;
  background-color: #d82e2e;
}

.update:hover {
  cursor: pointer;
  background-color: var(--x-dark-green);
}

.background {
  background-color: var(--light-green);
}

.title {
  font-style: italic;
}

</style>