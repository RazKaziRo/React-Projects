const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyAmi59jMOmUts_byudPH8I51pszlmFHsCQ",
  authDomain: "positive-fuze-157812.firebaseapp.com",
  projectId: "positive-fuze-157812",
  storageBucket: "positive-fuze-157812.appspot.com",
  messagingSenderId: "1038223563163",
  appId: "1:1038223563163:web:d6a4e0cbb83e1830dae93e",
  measurementId: "G-FTR8WV1GVR",
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get("/users", (req, res) => {
  db.collection("users")
    .orderBy("createAt", "desc")
    .get()
    .then((data) => {
      let users = [];
      data.forEach((doc) => {
        users.push({
          userId: doc.id,
          ...doc.data(), //spread
        });
      });
      return res.json(users);
    })
    .catch((err) => console.err(err));
});

app.post("/user", (req, res) => {
  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    createAt: new Date().toISOString(),
  };
  db.collection("users")
    .add(newUser)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created succesfuly!` });
    })
    .catch((err) => {
      res.status(500).json({ error: `somthing went wrong` });
      console.error(err);
    });
});

const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

const isEmail = (email) => {
  const regEx =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(regEx)) return true;
  else return false;
};

//Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }

  if(isEmpty(newUser.password)) errors.password = 'Most not be empty'
  if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Password must match'
  if(isEmpty(newUser.handle)) errors.handle = 'Most not be empty'

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);

  //TODO: validate data
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredatials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredatials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.region("europe-west3").https.onRequest(app);
