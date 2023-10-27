const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions/v2')

const { Timestamp } = require('firebase-admin/firestore')

const { firestoreService } = require('./admin')

exports.createOrder = onCall(async (request) => {
  const parseCreateOrderRequest = (request) => {    
    const getUserID = () => {
      try {
        return request.auth.uid
      } catch (err) {
        throw new HttpsError('unauthenticated', err.message)
      }
    }
  
    const validatePhoneNumber = (phoneNumber) => {
        if (!/^[\+0][0-9]{6,15}$/.test(phoneNumber)) {
          throw new HttpsError('invalid-argument', 'Invalid phone number.')
        }
        return phoneNumber
    }
  
    if (!request.data.name || !request.data.address) {
      throw new HttpsError('invalid-argument', 'All fields must be filled in.')
    }

    const items = []
  
    request.data.items.map(order => {
      items.push({
        ISBN: order.book.ISBN,
        offerID: order.offer.id
      })
    })

    return {
      buyerID: getUserID(),
      name: request.data.name,
      items: items,
      phone: validatePhoneNumber(request.data.phone),
      address: request.data.address,
      createdAt: Timestamp.now()
    }
  }

  const order = parseCreateOrderRequest(request)
  await firestoreService.collection('orders').add(order)

  await Promise.all(order.items.map(async (item) => {
    firestoreService.collection('offers')
      .doc(item.offerID)
      .update({ 'status': 'sold', 'buyerID': order.buyerID })
  }))
})
