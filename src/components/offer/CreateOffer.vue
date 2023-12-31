<template>
  <h2>Create a book offer</h2>
  <form @submit.prevent="">
    <input type="text" required placeholder="ISBN" v-model="ISBN" @blur="checkISBN">
    <input type="text" required placeholder="Title" v-model="title">
    <input type="text" required placeholder="Authors" v-model="authors">
    <input type="text" required placeholder="Price in EUR" v-model="price" @blur="checkPrice">
    <pre v-if="ISBN_error" class="error">{{ ISBN_error }}</pre>
    <pre v-if="priceError" class="error">{{ priceError }}</pre>
  </form>
  <div class="options">
    <button v-for="option in bookConditions" :key="option" @click="selectOption" :class="{'highlight':  selectedOption === option}">{{ option }}</button>
  </div>
  <button @click="handleSubmit" type="submit">Create</button>
  <BookConditionsDescription />
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getFunctions, httpsCallable } from 'firebase/functions'

import BookConditionsDescription from '@/components/book/BookConditionsDescription.vue'
import redirectToPageWithMessage from '@/composables/utils/redirectToPageWithMessage'

export default {
  components: { BookConditionsDescription },
  setup() {

    const bookConditions = ref(['New', 'As New', 'Good', 'Fair', 'Poor'])
    const selectedOption = ref('')
    const authors = ref('')
    const title = ref('')
    const ISBN = ref('')
    const ISBN_error = ref('')
    const price = ref('')
    const priceError = ref('')

    const functions = getFunctions()

    const router = useRouter()

    const checkISBN = async () => {
      ISBN.value = ISBN.value.trim()
      ISBN_error.value = ''

      if (!/^[0-9]{13}$/.test(ISBN.value)) {
        console.log('invalid isbn');
        ISBN_error.value = 'Invalid ISBN'
        return
      }
      
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN.value}`)
      const books = await response.json()

      if (books.totalItems == 0 || (
          books.items[0].volumeInfo.industryIdentifiers[0].identifier !== ISBN.value &&
          books.items[0].volumeInfo.industryIdentifiers[1].identifier !== ISBN.value
      )) {
        ISBN_error.value = 'ISBN may be invalid. Please check again.\nDisregard warning if book is newly published or rare.'
      } else {
        try {
          title.value = books.items[0].volumeInfo.title
          authors.value = books.items[0].volumeInfo.authors.join(', ')
        } catch (err) {
          console.log('Book data incomplete')
        }
      }
    }

    const selectOption = e => {
      selectedOption.value = e.target.innerHTML
    }

    const checkPrice = () => {
      priceError.value = ''
      if (!/^(([1-9][0-9]{0,8})|0)([.,][0-9]{1,2})?$/.test(price.value.trim())) {
        priceError.value = 'Invalid price'
      }
    }

    const handleSubmit = async () => {
      const createOffer = httpsCallable(functions, 'createOffer')
      console.log(selectedOption.value)
      try {
        await createOffer({
          title: title.value,
          authors: authors.value,
          ISBN: ISBN.value,
          condition: selectedOption.value,
          price: price.value
        })
        redirectToPageWithMessage(router, 'profile', 'Offer successfully created.', 'success')
      } catch (err) {
        redirectToPageWithMessage(router, 'profile', err.message, 'error')
      }
    };

    return { authors, title, ISBN, ISBN_error, price, priceError, bookConditions, selectedOption, checkISBN, checkPrice, handleSubmit, selectOption };
  },
}
</script>

<style>
.form pre {
  margin: 0;
  font-weight: 300;
}

.form {
  max-width: 600px;
  width: 100%;
}

.options {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.options button {
  margin: 20px 5px;
  width: 90px;
  padding: 5px 0px;
}
.highlight {
  background-color: #2fc521;
}
</style>