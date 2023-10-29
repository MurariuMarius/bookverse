const { HttpsError, onCall } = require('firebase-functions/v2/https')
const { firestoreService, authorizeOperation } = require('./admin')

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

  const data = await firestoreService
    .collection(request.data.collection)
    .doc(request.data.id).get()

  await authorizeOperation(request.auth.uid, async () => { 
    if (request.data.ownerIDField === '_id') {
      return data.id
    }
    return Reflect.get(data.data(), request.data.ownerIDField)
   })

  validateChangeDeliveryRequest(request.data)

  await firestoreService.collection(request.data.collection)
    .doc(request.data.id)
    .update({ name: request.data.name, phone: request.data.phone, address: request.data.address })
})