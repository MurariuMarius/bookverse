const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { firestoreService } = require('./admin')

exports.deleteOffer = onCall(async (request) => {
  const offer = request.data.offer

  if (offer.status === 'sold') {
    throw new HttpsError('invalid-argument', 'Cannot delete sold offer.')
  }

  await firestoreService.collection('offers').doc(offer.id).delete()
})