const fs = require('fs')
const path = require('path')
const http = require('http');
const agent = new http.Agent({keepAlive: true});

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp()
admin.firestore().settings({
  timestampsInSnapshots: true
})

const FUNCTIONS_FOLDER = './src'

fs.readdirSync(path.resolve(__dirname, FUNCTIONS_FOLDER)).forEach(file => {
  if (file.endsWith('.js')) {
    const fileBaseName = file.slice(0, -3)
    const functions = require(`${FUNCTIONS_FOLDER}/${fileBaseName}`)
    for(let i in functions) {
      if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === i) {
        exports[i] = functions[i]
      }
    }
  }
})

exports.connectionPooling = (req, res) => {
  req = http.request(
    {
      host: '',
      port: 80,
      path: '',
      method: 'GET',
      agent: agent,
    },
    resInner => {
      let rawData = ''
      resInner.setEncoding('utf8')
      resInner.on('data', chunk => {
        rawData += chunk
      })
      resInner.on('end', () => {
        res.status(200).send(`Data: ${rawData}`)
      })
    }
  )
  req.on('error', e => {
    res.status(500).send(`Error: ${e.message}`)
  })
  req.end()
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*
  1. config global variable to speed up the function execution.
  2. use process.env.FUNCTION_NAME to import the function that need.
  3. use functional programming.
*/
