import { firestoreService } from '@/firebase/config'
import useGetDocByID from './useGetDocByID'

const getOrdersForUserByID = async (id) => {

  const { getDocByID } = useGetDocByID()

  const orders = []
  const orderData = await firestoreService.collection('orders').where('buyerID', '==', id).get()
  orderData.forEach(doc => orders.push({ ...doc.data(), id: doc.id }))

  const orderMap = new Map()

  Promise.all(
    orders.map(async order => {
      orderMap.set(order, [])
      Promise.all(order.items.map(async item => {
        const [book, offer] = await Promise.all([
          getDocByID('books', item.ISBN),
          getDocByID('offers', item.offerID)
        ])
        orderMap.get(order).push({ book, offer })
      }))
    })
  )

  return orderMap
}

const useGetOrdersForUserByID = () => {
  return { getOrdersForUserByID }
}

export default useGetOrdersForUserByID