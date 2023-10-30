const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { firestoreService, authorizeOperation } = require('../admin')
const { getDocByID } = require('../getDocByID')

exports.deleteOffer = onCall(async (request) => {

  await authorizeOperation(request.auth.uid, async () => {
    const offer = await getDocByID('offers', request.data.offer.id)
    if (offer.status === 'sold') {
      return null
    }
    return offer.sellerID
  })

  const offer = request.data.offer

  if (offer.status === 'sold') {
    throw new HttpsError('invalid-argument', 'Cannot delete sold offer.')
  }

  await firestoreService.collection('offers').doc(offer.id).delete()
})