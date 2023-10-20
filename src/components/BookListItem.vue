<template>
  <article class="book">
    <img :src=imageSource alt="book icon" class="book-icon">
    <div>
      <h2 class="title">Murder in the Orient Express</h2>
      <h3 class="author">Agatha Christie</h3>
      <div class="price">
        <p>From</p>
        <h2>Price</h2>
        <h2>€</h2>
      </div>
    </div>
  </article>
</template>

<script>
import { ref } from 'vue';

export default {
  props: { ISBN: String },
  setup(props) {

    const imageSource = ref('')
    
    const getBookIcon = async (ISBN) => {
      const bookFound = () => {
        console.log(books)
        return books.totalItems != 0 && (
          books.items[0].volumeInfo.industryIdentifiers[0].identifier === ISBN ||
          books.items[0].volumeInfo.industryIdentifiers[1].identifier === ISBN
        )
      }

      console.log(ISBN)
      
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`)
      const books = await response.json()
      

      if (bookFound()) {
        console.log(books.items[0].volumeInfo.imageLinks.thumbnail)
        try {
          imageSource.value = books.items[0].volumeInfo.imageLinks.thumbnail
          return
        } catch (err) {
          console.log(err.message);
        }
      } 
      
      imageSource.value = require('@/assets/book-icon.svg')
    }
    
    getBookIcon(props.ISBN)
  
    return { imageSource }
  }
}
</script>

<style scoped>
img {
  margin: auto;
  height: 300px;
  max-width: 90%;
}

.book {
  background-color: #e8e5e5;
  padding: 20px 35px;
  border-radius: 20px;
  justify-content: center;
  margin: 20px;
  display: flex;
  flex-direction: column;
  width: 275px;
}

.price {
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  width: 100%;
}

.price h2 {
  color: #01bf14;
  margin-left: 10px
}

.title {
  font-size: xx-large;
}

.author {
  font-size: x-large;
  font-weight: 400;
}
</style>