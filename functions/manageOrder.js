const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { firestoreService, authorizeOperation } = require('./admin')
const { getDocByID } = require('./getDocByID')
const { Timestamp } = require('firebase-admin/firestore')

const secondsAfterPlacementAllowingOrderModifications = 60

const getOwnerID = (order) => {
  const now = Timestamp.now()
  const ownerID = now.seconds - order.createdAt.seconds < secondsAfterPlacementAllowingOrderModifications ? order.buyerID : null
  return async () => { return ownerID }
}

exports.deleteOrder = onCall(async (request) => {

  const order = await getDocByID('orders', request.data.orderID)

  await authorizeOperation(request.auth.uid, getOwnerID(order))
  
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

  await authorizeOperation(request.auth.uid, getOwnerID(order))

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