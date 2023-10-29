import { ref } from 'vue'

const useGetBookIcon = () => {

  const imageSource = ref('')

  const getBookIcon = async (URL) => {
    if (URL) {
      imageSource.value = URL
    } else {
      imageSource.value = require('@/assets/book-icon.svg')
    }
  }

  return { imageSource, getBookIcon }
}

export default useGetBookIcon