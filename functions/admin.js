const { initializeApp } = require('firebase-admin/app')

const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')

const app = initializeApp()

const firestoreService = getFirestore()
const storageBucket = getStorage().bucket()


module.exports = { firestoreService, storageBucket }
