'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

exports.addMessage = functions.https.onRequest (async (req, res) => {
  const uid = req.query.uid
  const name = req.query.name
  const value = req.query.value
  const time = new Date(req.query.time)
  const writeResult = await admin.firestore().collection('messages').add({
    UID: uid,
    Name: name,
    Value: value,
    Time: time
  })
})