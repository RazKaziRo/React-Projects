const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require('./util/fbAuth');

const  {getAllUsers, signup, login} = require('./handlers/users')
 

//Users Route
app.get('/users', FBAuth, getAllUsers);
app.post("/signup", signup);
app.post('/login', login);

exports.api = functions.region("europe-west3").https.onRequest(app);
