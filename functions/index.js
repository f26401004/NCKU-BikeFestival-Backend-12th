const fs = require('fs')
const path = require('path')

const FUNCTIONS_FOLDER = './src'

fs.readdirSync(path.resolve(__dirname, FUNCTIONS_FOLDER)).forEach(file => {
  if (file.endsWith('.js')) {
    const fileBaseName = file.slice(0, -3)
    const functions = require(`${FUNCTIONS_FOLDER}/${fileBaseName}`)
    for(let i in functions) {
      exports[i] = functions[i]
    }
  }
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Get Item API

// Complete Achievement API

// Sign Up Activity API

// Get Reward API

