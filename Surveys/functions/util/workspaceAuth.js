const firebase = require("firebase");
const { mysqldb } = require("../util/admin");
const FBAuth = require("./fbAuth");

module.exports = (req, res, next) => {
  let sql = `SELECT * from users_workspaces WHERE user_id = ${req.user.id} AND workspace_id = ${req.params.id}`;
  mysqldb.query(sql, (err, result, fields) => {
    if (err) {
      throw err;
    }
    console.log('CURRENT USER ID: '+JSON.stringify(req.user.id));
    if (result.length > 0) {
      return next();
    } else {
      res.status(403).json({ messege: "Unauthorized access or workspace not found" });
    }
  });
 
};
