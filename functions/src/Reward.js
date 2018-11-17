const functions = require('firebase-functions')
const admin = require('firebase-admin')

const getEXP = functions.https.onRequest( async (req, res) => {
  const uid = req.query.uid
  const value = req.query.value
  const target = admin.firestore.collecion('users').doc(uid)
  try {
    const originValue = await target.get().data().Attribute
    originValue.EXP += value
    const result = await target.update({
      Attribute: originValue
    })
  } catch (error) {
    console.log(error)
  }
})

const getHP = functions.https.onRequest( async (req, res) => {
  const uid = req.query.uid
  const value = req.query.value
  const target = admin.firestore.collecion('users').doc(uid)
  try {
    const originValue = await target.get().data().Attribute
    originValue.HP += value
    const result = await target.update({
      Attribute: originValue
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = {
  getEXP,
  getHP
}