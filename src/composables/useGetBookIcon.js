import { ref } from 'vue'

const useGetBookIcon = () => {

	const imageSource = ref('')

	const getBookIcon = async (ISBN) => {
		const bookFound = () => {
			return books.totalItems != 0 && (
				books.items[0].volumeInfo.industryIdentifiers[0].identifier === ISBN ||
				books.items[0].volumeInfo.industryIdentifiers[1].identifier === ISBN
			)
		}
	
		const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`)
		const books = await response.json()
	
	
		if (bookFound()) {
			// console.log(books.items[0].volumeInfo.imageLinks.thumbnail)
			try {
				imageSource.value = books.items[0].volumeInfo.imageLinks.thumbnail
				return
			} catch (err) {
				console.log(err.message);
			}
		}
	
		imageSource.value = require('@/assets/book-icon.svg')
	}

	return { imageSource, getBookIcon }
}

export default useGetBookIcon