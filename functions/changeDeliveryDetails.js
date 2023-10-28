const { HttpsError, onCall } = require('firebase-functions/v2/https')
const { firestoreService } = require('./admin')
const { logger } = require('firebase-functions/v2')

exports.changeDeliveryDetails = onCall(async (request) => {
  const validateChangeDeliveryRequest = (requestData) => {
    const isValidPhone = (phone) => {
      if (!/^[\+0][0-9]{6,15}$/.test(phone)) {
        throw new HttpsError('invalid-argument', 'Invalid phone number.')
      }
      return true
    }
  
    if (!isValidPhone(requestData.phone) || !requestData.name || !requestData.address) {
      throw new HttpsError('invalid-argument', 'Fields must not be empty.')
    }
  }

  validateChangeDeliveryRequest(request.data)

  await firestoreService.collection(request.data.collection)
    .doc(request.data.id)
    .update({ name: request.data.name, phone: request.data.phone, address: request.data.address })
})