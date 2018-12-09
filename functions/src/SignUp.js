const functions = require('firebase-functions')
const admin = require('firebase-admin')

// for academic department
const signUpActivity = functions.https.onCall( async (data, context) => {
  const uid = data.uid
  const aid = data.aid
  try {
    const target = admin.firestore().collection('users').doc(uid)
    const originValue = await target.get().data().Activities
    originValue.push(aid)
    const result = await target.update({
      Activities: originValue
    })
  } catch (error) {
    console.log(error)
  } 
})

const cancelActivity = functions.https.onCall( async (data, context) => {
  const uid = data.uid
  const aid = data.aid
  try {
    const target = admin.firestore().collection('users').doc(uid)
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