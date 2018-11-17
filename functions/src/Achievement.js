const functions = require('firebase-functions')

// Complete Mission API
const complete = functions.https.onRequest( async (req, res) => {
  const uid = req.query.uid
  const mid = req.query.mid
  const target = admin.firestore.collection('users').doc(uid)
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
  complete
}