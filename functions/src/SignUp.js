const functions = require('firebase-functions')
const admin = require('firebase-admin')

const signUpActivity = functions.https.onRequest( async (req, res) => {
  const uid = req.query.uid
  const aid = req.qeury.aid
  try {
    const target = admin.firestore.collection('users').doc(uid)
    const originValue = await target.get().data().Activities
    originValue.push(aid)
    const result = await target.update({
      Activities: originValue
    })
  } catch (error) {
    console.log(error)
  } 
})

const cancelActivity = functions.https.onRequest( async (req, res) => {
  const uid = req.query.uid
  const aid = req.query.aid
  try {
    const target = admin.firestore.collection('users').doc(uid)
    const originValue = await target.get().data().Activities
    const index = originValue.indexOf(aid)
    if (index < 0) {
      return
    }
    originValue.splice(index, 1)
    const result = await target.update({
      Activities: originValue
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = {
  signUpActivity,
  cancelActivity
}