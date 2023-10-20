<template>
  <article class="book">
    <!-- <img src="@/assets/book-icon.svg" alt="book icon" class="book-icon"> -->
    <img src="http://books.google.com/books/content?id=4EBHUjNLuyIC&printsec=frontcover&img=1&zoom=1&source=gbs_api" alt="book icon" class="book-icon">
    <div>
      <h2 class="title">Murder in the Orient Express</h2>
      <h3 class="author">Agatha Christie</h3>
      <div class="price">
        <p>From</p>
        <h2>Price</h2>
        <h3>€</h3>
      </div>
    </div>
  </article>
</template>

<script>

</script>

<style scoped>
img {
  margin: auto;
  width: 70%;
  max-width: 90%;
}

.book {
  background-color: #e8e5e5;
  padding: 20px 35px;
  border-radius: 20px;
  justify-content: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 20%;
  max-width: 400px;
}

.price {
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  width: 100%;
}

.price h2 {
  margin: 0px 10px;
}

.price h3, .price p {
  margin: 0;
}

.title {
  font-size: xx-large;
}

.author {
  font-size: x-large;
  font-weight: 400;
}
</style>