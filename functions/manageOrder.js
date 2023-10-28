const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { firestoreService } = require('./admin')
const { getDocByID } = require('./getDocByID')
const { logger } = require('firebase-functions/v2')


exports.deleteOrder = onCall(async (request) => {
  const order = await getDocByID('orders', request.data.orderID)
  Promise.all(order.items.map(async (item) => {
    await firestoreService.collection('offers').doc(item.offerID).update({ buyerID: null, status: 'available' })
  }))
  await firestoreService.collection('orders').doc(request.data.orderID).delete()
})

exports.removeItems = onCall(async (request) => {
  const removeOffers = (items, offersToBeRemoved) => {
    return items.reduce((acc, el) => {
      if (!offersToBeRemoved.includes(el.offerID)) {
        acc.push(el)
      }
      return acc
    }, [])
  }

  const orderID = request.data.orderID
  const offerIDs = request.data.offerIDs.trim().split(', ')

  const notFoundItems = []
  const offersToBeRemoved = []
  const amountsToBeDeducted = []

  const order = await getDocByID('orders', orderID)

  await Promise.all(offerIDs.map(async (offerID) => {
    try {
      const offer = await getDocByID('offers', offerID)
      await firestoreService.collection('offers').doc(offerID).update({ buyerID: null, status: 'available' })
      offersToBeRemoved.push(offerID)
      amountsToBeDeducted.push(parseFloat(offer.price))
    } catch (err) {
      notFoundItems.push(offerID)
    }
  }))

  order.items = removeOffers(order.items, offersToBeRemoved)

  const amountToBeDeducted = amountsToBeDeducted.reduce((acc, el) => {
    return acc + el
  }, 0)

  order.totalAmount = Number(Math.max(order.totalAmount - amountToBeDeducted, 0).toFixed(2))

  await firestoreService.collection('orders').doc(orderID).update({
    items: order.items,
    totalAmount: order.totalAmount
  })

  if (notFoundItems.length != 0) {
    throw new HttpsError('not-found', `Could not process ${notFoundItems}`)
  }
})