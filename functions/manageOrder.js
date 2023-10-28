const { onCall } = require("firebase-functions/v2/https")
const { firestoreService } = require("./admin")

exports.deleteOrder = onCall(async (request) => {
  await firestoreService.collection('orders').doc(request.data.orderID).delete()
})