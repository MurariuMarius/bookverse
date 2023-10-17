<template>
  <div>
    <h2>Create a book offer</h2>
    <div>
      <div class="form" @submit.prevent="handleSubmit">
        <input type="text" required placeholder="Title" v-model="title">
        <input type="text" required placeholder="Authors" v-model="authors">
        <input type="text" required placeholder="ISBN" v-model="ISBN" @blur="checkISBN">
        <pre class="error">{{ ISBN_error }}</pre>
      </div>
      <div class="options">
        <button v-for="option in bookConditions" :key="option" @click="selectOption" :class="{'highlight':  selectedOption === option}">{{ option }}</button>
      </div>
      <button @click="handleSubmit" type="submit">Create</button>
    </div>
      <BookConditionsDescription />
  </div>
</template>

<script>
import { ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'

import BookConditionsDescription from '@/components/BookConditionsDescription.vue'

export default {
  components: { BookConditionsDescription },
  setup() {

    const bookConditions = ref(['New', 'As New', 'Good', 'Fair', 'Poor'])
    const selectedOption = ref('')
    const authors = ref('')
    const title = ref('')
    const ISBN = ref('')
    const ISBN_error = ref('')

    const functions = getFunctions()

    const checkISBN = async () => {
      ISBN.value = ISBN.value.trim()
      ISBN_error.value = ''

      if (!/^[0-9]{13}$/.test(ISBN.value)) {
        console.log('invalid isbn');
        ISBN_error.value = 'Invalid ISBN'
        return
      }
      
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${ISBN.value}+isbn`)
      const books = await response.json()

      if (books.totalItems == 0) {
        ISBN_error.value = 'ISBN may be invalid. Please check again.\nDisregard warning if book is newly published or rare.'
      }
    }

    const selectOption = e => {
      console.log('here');
      selectedOption.value = e.target.innerHTML
    }

    const handleSubmit = () => {
      const createOffer = httpsCallable(functions, 'createOffer')
      console.log(selectedOption.value)
      createOffer({ title: title.value, authors: authors.value, ISBN: ISBN.value, condition: selectedOption.value })
        .then(result => {
          console.log(result)
        })
        .catch(err => {
          console.log(err.message)
        })
    };

    return { authors, title, ISBN, ISBN_error, bookConditions, selectedOption, checkISBN, handleSubmit, selectOption };
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
  margin-top: 100px;
  background-color: #2fc521;
}
</style>