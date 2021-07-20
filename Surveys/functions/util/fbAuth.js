const { admin, db, mysqldb } = require("./admin");
const firebase = require("firebase");
const { user } = require("firebase-functions/lib/providers/auth");

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found.");
    return res.status(403).json({ error: "Unauthorized" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      let sql = `SELECT * FROM users WHERE handle = '${req.user.uid}'`;
      mysqldb.query(sql, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(403).json(err);
        }
        req.user.id = result[0].user_id;
        req.user.handle = result.handle;
        return next();
      });

    });
};
