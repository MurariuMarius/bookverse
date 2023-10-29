const { firestoreService } = require('./admin')

const getDocByID = async (collection, ID) => {
    const res = await firestoreService
      .collection(collection)
      .doc(ID)
      .get()
  
    return res.data();
}

module.exports = { getDocByID }