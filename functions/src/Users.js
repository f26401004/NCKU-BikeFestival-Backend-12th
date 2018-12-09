const functions = require('firebase-functions')
const admin = require('firebase-admin')

// initialize global object
const userModel = admin.firestore().collection('users')

const newUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid
  const username = data.username
  if (!(typeof uid === 'string') || uid.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with uid')
  }
  if (!(typeof username === 'string') || username.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with username')
  }
  try {
    await userModel.doc(uid).set({
      Achievements: [],
      Activities: [],
      Attribute: {
        Weapon: "",
        Armor: "",
        EXP: 0,
        HP: 100,
        Title: '',
        School: "",
        Grade: 1,
        Scores: {
          Academic: 0,
          Activity: 0,
          Love: 0
        },
        Lesson: {
          Attribute: {
            Logic: 0,
            Language: 0,
            Humanity: 0,
            General: 0,
            Nature: 0
          },
          OnGoing: {
            Language: [],
            Humanity: [],
            Logic: [],
            Nature: [],
            General: []
          },
          Finished: {
            Language: [],
            Humanity: [],
            Logic: [],
            Nature: [],
            General: []
          }
        },
        Talent: ""
      },
      Items: [],
      Location: new admin.firestore.GeoPoint(0, 0),
      MissionComplete: [],
      Name: username,
      Online: true,
      Learning: false,
      Role: 0,
      Passed
    })
  } catch (error) {
    throw new functions.https.HttpsError('newUser-error', error);
  }
})

const onlineRefresh = functions.https.onCall( async (data, context) => {
  const uid = data.uid
  const value = parseInt(data.value)
  if (!(typeof uid === 'string') || uid.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with uid')
  }
  if (!(typeof value === 'number') || value > 1 || value < 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with value and value must be 1 or 0')
  }
  try {
    await userModel.doc(uid).update({
      Online: value === 1 ? true : false
    })
  } catch (error) {
    throw new functions.https.HttpsError('onlineRefresh-error', error);
  }
})

module.exports = {
  newUser,
  onlineRefresh
}