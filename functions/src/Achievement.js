const functions = require('firebase-functions')

// Complete Mission API
const completeMisson = functions.https.onCall( async (data, context) => {
  const uid = data.uid
  const mid = data.mid
  const target = admin.firestore().collection('users').doc(uid)
  try {
    const originValue = await target.get().data().MissionComplete
    if (originValue.indexOf(mid) > 0) {
      return
    }
    originValue.push(mid)
    target.update({
      MissionComplete: originValue
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = {
  completeMisson
}