const { getAuth } = require("firebase-admin/auth")
const { onCall, HttpsError } = require("firebase-functions/v2/https")
const { firestoreService } = require("./admin")

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

exports.resetEmail = onCall(async (request) => {

  if (!emailRegex.test(request.data.email)) {
    throw new HttpsError('invalid-argument', 'Invalid email address.')
  }

  await getAuth()
    .updateUser(request.data.uid, {
      email: request.data.email
    })

  await firestoreService.collection('users').doc(request.data.uid).update({ 'email': request.data.email })
})