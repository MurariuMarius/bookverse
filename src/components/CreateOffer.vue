<template>
  <div>
    <h2>Create a book offer</h2>
    <div>
      <input type="text" placeholder="ISBN" v-model="ISBN">
      <div class="options">
        <button v-for="option in options" :key="option" @click="selectOption" :class="{'highlight':  selectedOption === option}">{{ option }}</button>
      </div>
      <button @click="handleSubmit" type="submit">Create</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'

export default {
  setup() {

    const options = ref(['A', 'B', 'C'])
    const selectedOption = ref('')
    const ISBN = ref('');

    const functions = getFunctions()

    const selectOption = e => {
      selectedOption.value = e.target.innerHTML
    }

    const handleSubmit = () => {
      const createOffer = httpsCallable(functions, 'createOffer')
      createOffer({ ISBN: ISBN.value, option: selectedOption.value })
        .then(result => {
          console.log(result.data)
        })
        .catch(err => {
          console.log(err.message)
        })

        // TODO: Request further book details if ISBN not found
    };

    return { ISBN, options, selectedOption, handleSubmit, selectOption };
  },
}
</script>

<style scoped>
.options {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.options button {
 margin: 10px;
}
.highlight {
  margin-top: 100px;
  background-color: #2fc521;
}
</style>