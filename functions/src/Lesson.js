const functions = require('firebase-functions')
const admin = require('firebase-admin')

// initialize global object
const limitModel = admin.firestore().collection('settings').doc('Grade')
const userModel = admin.firestore().collection('users')
const lessonModel = {
  Language: admin.firestore().collection('lesson-language'),
  Humanity: admin.firestore().collection('lesson-humanity'),
  Logic: admin.firestore().collection('lesson-logic'),
  Nature: admin.firestore().collection('lesson-nature'),
  General: admin.firestore().collection('lesson-general')
}

const getLessonByType = functions.https.onCall(async (data, context) => {
  const type = data.type
  const uid = data.uid
  if (!(typeof type === 'string') || type.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with lesson type')
  }
  if (!(typeof uid === 'string') || uid.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with user id')
  }
  try {
    const limit = (await limitModel.get()).data()
    // get user attribute from user db
    const userInfo = (await userModel.doc(uid).get()).data()
    const attribute = userInfo.Attribute.Lesson.Attribute
    const grade = userInfo.Attribute.Grade
    const lessons = (await lessonModel[type].get())
    if (type !== 'General') {
      lessons.docs.filter(doc => grade >= doc.data().Grade && attribute[type] >= limit[type][grade])
    }
    const result = lessons.docs.map(target => {
      return { Id: target.id, Name: target.data().Name } 
    })
    return result
  } catch (error) {
    console.log(error.message)
    throw new functions.https.HttpsError('getLessonByType-error', error);
  }
})

const chooseLesson = functions.https.onCall(async (data, context) => {
  const uid = data.uid
  const type = data.type
  const lessons = data.lessons
  if (!(typeof uid === 'string') || (typeof uid === 'string' && uid.length === 0)) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with user id')
  }
  if (!(typeof type === 'string') || (typeof type === 'string' && type.length === 0)) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with lesson type')
  }
  if (!lessons) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with lesson id')
  }
  try {
    const userInfo = (await userModel.doc(uid).get()).data()
    userInfo.Attribute.Lesson.OnGoing[type] = userInfo.Attribute.Lesson.OnGoing[type].concat(lessons)
    await (userModel.doc(uid)).update(userInfo)
  } catch (error) {
    console.log(error.message)
    throw new functions.https.HttpsError('chooseLesson-error', error)
  }
})

const getLessonQuestionByLidAndType = functions.https.onCall(async (data, context) => {
  const lid = data.lid
  const type = data.type
  if (!(typeof lid === 'string') || lid.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with lesson id')
  }
  if (!(typeof type === 'string') || type.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with lesson type')
  }
  try {
    const value = (await lessonModel[type].doc(lid).get()).data()
    return value.Questions[Math.floor(Math.random() * 3)]
  } catch (error) {
    console.log(error.message)
    throw new functions.https.HttpsError('getLessonQuestionByLidAndType-error', error.message)
  }
})

const learningNow = functions.https.onCall(async (data, context) => {
  const uid = data.uid
  if (!(typeof uid === 'string') || uid.length === 0) {
    throw new functions.https.HttpsError('invalid argument', 'The function must be called with user id')
  }
  try {
    const originValue = (await userModel.doc(uid).get()).data()
    originValue.Attribute.Lesson.Attribute.Status = true
    // TODO: set the spantime according to chosen lesson
    await userModel.doc(uid).update(originValue)
  } catch (error) {
    throw new functions.https.HttpsError('learningNow-error', error)
  }
})

module.exports = {
  getLessonByType,
  chooseLesson,
  getLessonQuestionByLidAndType,
  learningNow
}