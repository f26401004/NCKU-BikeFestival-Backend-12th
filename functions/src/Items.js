const functions = require('firebase-functions')
const admin = require('firebase-admin')

const getItem = functions.https.onRequest( async (req, res) => {
  const uid = req.query.uid
  const iid = req.query.iid
  const target = admin.firestore.collection('users').doc(uid)
  try {
    const originValue = await target.get().data().Items
    if (originValue.iid) {
      originValue[iid]++
    } else {
      originValue.iid = 1
    }
  } catch (error) {
    console.log(error)
  }
})

const deleteItem = functions.https.onRequest( async (req, res) => {
  const uid = req.query.uid
  const iid = req.query.iid
  const target = admin.firestore.collection('users').doc(uid)
  try {
    const originValue = await target.get().data().Items
    if (originValue.iid) {
      originValue.iid--
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = {
  getItem,
  deleteItem
}