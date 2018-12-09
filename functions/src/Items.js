const functions = require('firebase-functions')
const admin = require('firebase-admin')

const getItem = functions.https.onCall( async (data, context) => {
  const uid = data.uid
  const iid = data.iid
  const target = admin.firestore().collection('users').doc(uid)
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

const deleteItem = functions.https.onCall( async (data, context) => {
  const uid = data.uid
  const iid = data.iid
  const target = admin.firestore().collection('users').doc(uid)
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