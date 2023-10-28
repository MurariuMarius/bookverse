const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')
const { HttpsError } = require('firebase-functions/v2/https')

const ADMINS = ['ObBkUOx8KgMtNUrU0oy5ohOdOfz1']

const app = initializeApp()

const firestoreService = getFirestore()
const storageBucket = getStorage().bucket()

const authorizeOperation = async (userID, getOwnerID) => {
  const ownerID = await getOwnerID()

  if (userID !== ownerID && !ADMINS.includes(userID)) {
    throw new HttpsError('permission-denied', 'Unauthorized')
  }
}

module.exports = { firestoreService, storageBucket, authorizeOperation }
