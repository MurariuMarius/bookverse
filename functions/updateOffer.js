const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { logger } = require('firebase-functions/v2')

const { firestoreService } = require('./admin')

const bookConditions = ['New', 'As New', 'Good', 'Fair', 'Poor']

exports.updateOffer = onCall(async (request) => {
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