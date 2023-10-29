const { getAuth } = require("firebase-admin/auth")
const { onCall, HttpsError } = require("firebase-functions/v2/https")
const { firestoreService, authorizeOperation } = require("./admin")

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const getOwnerID = (ownerID) => {
  return async () => { return ownerID }
}

exports.resetEmail = onCall(async (request) => {

  await authorizeOperation(request.auth.uid, getOwnerID(request.data.uid))
  
  if (!emailRegex.test(request.data.email)) {
    throw new HttpsError('invalid-argument', 'Invalid email address.')
  }
  
  await getAuth()
  .updateUser(request.data.uid, {
    email: request.data.email
  })
  
  await firestoreService.collection('users').doc(request.data.uid).update({ 'email': request.data.email })
})

exports.deleteUser = onCall(async (request) => {
  
  await authorizeOperation(request.auth.uid, getOwnerID(request.data.uid))
  
  await getAuth()
    .deleteUser(request.data.uid)

  await firestoreService.collection('users').doc(request.data.uid).delete()
})