const { admin, db, mysqldb } = require("../util/admin");
const firebase = require("firebase");
const { firebaseConfig } = require("../util/config");

firebase.initializeApp(firebaseConfig);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
  reauthenticate,
} = require("../util/validators");

const { json } = require("express");

exports.getAllUsers = (req, res) => {
  let sql = "SELECT * FROM users";
  return mysqldb.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.code });
    }
    let users = [];
    rows.forEach((row) => {
      users.push({
        ...row,
      });
    });
    return res.json(users);
  });
};

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role_id: 1
  };

  const { errors, valid } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);

  const noImg = "no-image.png";

  let token, userId;
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredatials = {
        handle: userId,
        email: newUser.email,
        role_id: newUser.role_id,
        user_avatar: noImg
      };
      //mysql
      let sql = "INSERT INTO users SET ?";
      return mysqldb.query(sql, userCredatials);
      //return db.doc(`/users/${newUser.handle}`).set(userCredatials); firestore
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "כתובת דואר אלקטרוני כבר קיימת במערכת" });
      } 
      if(err.code ==="auth/weak-password"){
        return res.status(400).json({ password: "סיסמא חלשה" });
      }
      else {
        return res.status(500).json({ error: err.code });
      }
    });
};

//Log user in
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { errors, valid } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "סיסמא שגויה" });
      }
      if (err.code === "auth/user-not-found") {
        return res
          .status(403)
          .json({ general: "משתמש לא קיים" });
      }
      if(err.code === "auth/invalid-email"){
        return res
        .status(403)
        .json({ general: "כתובת מייל לא תקינה אנא נסה שנית" });
      }
      return res.status(500).json({ error: err.code });
    });
};

//Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ messege: "Details added successfuly" });
    })
    .catch((err) => {
      console.error(err);
      json.status(500).json({ error: err.code });
    });
};

exports.changePassword = (req, res) => {
  const user = firebase.auth().currentUser
  user
    .updatePassword(req.body.newPassword)
    .then(() => {
      res.status(200).json({ messege: "Password Updated" });
    })
 .catch((err) => {
  console.error(err);
  res.status(500).json({error: err.code});
});
};

exports.getSingleUser = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.params.userId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      userData = doc.data();
      userData.userId = doc.id;
      return res.status(200).json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//Get own user details

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  let sql = `SELECT * FROM users WHERE handle = '${req.user.uid}'`;

  mysqldb.query(sql, (err, result, fields) => {

    if (err) {
      throw err;
    }
    if (result.length > 0) {
        userData.credentials = result[0];
        return res.json(userData);
    } else {
      res.status(404).json({ messege: "No User found" });
    }
  });
};

//Upload a profile Image for user
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);

    if (mimetype !== "image/png" && mimetype !== "image/png")
      return res.status(400).json({ error: "Wrong file type submitted" });

    const imageExtension = filename.split(".")[filename.split(".").length - 1]; //last index of last split by .
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfuly" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.getAllUserWorkspaces = (req, res) =>{
  let sql = `SELECT * FROM workspaces WHERE id IN (SELECT workspace_id FROM users_workspaces WHERE user_id ='${req.params.userId}' )`;
  mysqldb.query(sql, (err, result, fields) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
        let workspaces = [];
        result.forEach((row) => {
          workspaces.push(
            row,
          );
        });
        return res.json(workspaces);
    } else {
      res.status(404).json({ messege: "No Workspaces found" });
    }
  });
}