const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions/v2')

const { firestoreService, authorizeOperation } = require('./admin')
const { getDocByID } = require('./getDocByID')

const bookConditions = ['New', 'As New', 'Good', 'Fair', 'Poor']

exports.updateOffer = onCall(async (request) => {

  await authorizeOperation(request.auth.uid, async () => {
    const offer = await getDocByID('offers', request.data.offer.id)
    return offer.sellerID
  })

  const parseOfferUpdateRequest = (request) => {
    const validatePrice = (price) => {
      const validPrice = parseFloat(price.replace(',', '.'))
      if (isNaN(validPrice)) {
        throw new HttpsError('invalid-argument', 'Invalid price')
      }
      return validPrice
    }

    const condition = request.data.offer.condition

    if (!bookConditions.includes(condition)) {
      throw new HttpsError('invalid-argument', 'Invalid book condition')
    }

    const price = validatePrice(request.data.offer.price)

    return [price, condition]
  }

  const [price, condition] = parseOfferUpdateRequest(request)

  firestoreService.collection('offers')
    .doc(request.data.offer.id)
    .update({ price, condition })
})