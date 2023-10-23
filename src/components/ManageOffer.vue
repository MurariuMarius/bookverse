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
        <button v-for="option in bookConditions" :key="option" @click="selectOption" :class="{'highlight':  selectedOption === option}">{{ option }}</button>
      </div>
      <div class="inline">
        <button class="update" @click="handleUpdate">Update</button>
        <button class="delete" @click="handleDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useRouter } from 'vue-router';
import { firestoreService } from '@/firebase/config';

export default {
  emits: [ 'close' ],
  props: { offer: Object, title: String, authors: String },
  setup(props, { emit }) {
    const bookConditions = ref(['New', 'As New', 'Good', 'Fair', 'Poor'])
    const selectedOption = ref(`${props.offer.condition}`)
    const price = ref(`${props.offer.price}`)
    const priceError = ref('')

    const functions = getFunctions()

    const router = useRouter()

    const selectOption = e => {
      selectedOption.value = e.target.innerHTML
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

    const redirectToProfileWithMessage = (message) => {
      router.push({ name: 'profile', query: { msg:  message}})
            setTimeout(() => {
              router.go()
            }, 100)
    }

    const handleUpdate = () => {
      if (!priceError.value) {        
        const updateOffer = httpsCallable(functions, 'updateOffer')
        const offer = {...props.offer, price: price.value, condition: selectedOption.value }
        updateOffer({offer: offer})
          .then(result => {
            redirectToProfileWithMessage('Offer updated successfully')
          })
          .catch(err => {
            console.log(err)
          })
      }
    }

    const handleDelete = async () => {
      await firestoreService.collection('offers').doc(props.offer.id).delete()
      redirectToProfileWithMessage('Offer deleted successfully')
    }

    return { bookConditions, price, priceError, selectedOption, close, checkPrice, handleUpdate, handleDelete, selectOption }
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
  background-color: #019c11;
}

.background {
  background-color: var(--light-green);
}

.title {
  font-style: italic;
}

</style>