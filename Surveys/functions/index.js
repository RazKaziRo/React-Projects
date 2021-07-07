const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require('express');
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

app.get('/users', (req, res) =>{
    admin
    .firestore()
    .collection("users")
    .orderBy('createAt', 'desc')
    .get()
    .then((data) => {
      let users = [];
      data.forEach((doc) => {
        users.push({
            userId: doc.id,
            ...doc.data()//spread
        });
      });
      return res.json(users);
    })
    .catch((err) => console.err(err));
})


app.post('/user', (req, res) => {
    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        createAt: admin.firestore.Timestamp.fromDate(new Date()),
    }
    admin.firestore()
    .collection('users')
    .add(newUser)
    .then(doc => {
        res.json({message: `document ${doc.id} created succesfuly!`})
    })
    .catch(err =>{
        res.status(500).json({error: `somthing went wrong`});
        console.error(err);
    })
})

//https://baseurl.com/api/

exports.api = functions.https.onRequest(app);