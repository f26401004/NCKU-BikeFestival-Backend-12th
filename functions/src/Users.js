const functions = require('firebase-functions')
const admin = require('firebase-admin')

const newUser = functions.https.onRequest((req, res) => {
  const UID = req.query.uid
  const username = req.query.username
  admin.firestore.collestion('users').doc(UID).set({
    Achievements: [],
    Attribute: {
      Weapon: "",
      Armor: "",
      EXP: 0,
      HP: 100,
      Title: ''
    },
    Cards: {},
    Items: [],
    Location: admin.firestore.GeoPoint(0, 0),
    MissionComplete: [],
    Name: username,
    Online: true,
    Role: 0
  })
})

module.exports = {
  newUser
}