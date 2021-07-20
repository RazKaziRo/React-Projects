const { admin, db, mysqldb } = require("../util/admin");
const firebase = require("firebase");
const e = require("express");

exports.workspaceAddUser = (userId, workspaceId) => {
  let sql = `INSERT INTO users_workspaces (user_id, workspace_id) VALUES (${userId}, ${workspaceId})`;
  let query = mysqldb.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      throw err;
    }
  });
};

exports.createWorkspace = (req, res) => {
  let newWorkspace = {
    name: req.body.workspaceName,
  };

  let sql = "INSERT INTO workspaces SET ?";
  let query = mysqldb.query(sql, newWorkspace, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }

    this.workspaceAddUser(req.user.id, result.insertId); //add user to created workspace
    return res.status(201).json({ messege: "Workspace created succesfully" });
  });
};

exports.renameWorkspace = (req, res) => {
  let newName = req.body.newWorkpaceName;
  let sql = `UPDATE workspaces SET name = '${newName}' WHERE id = ${req.params.id}`;
  let query = mysqldb.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    } else {
      return res
        .status(200)
        .json({ messege: "Workspace name change succesfully" });
    }
  });
};

exports.deleteWorkspace = (req, res) => {

    let sql = `DELETE FROM workspaces WHERE id = ${req.params.id}`;
    mysqldb.query(sql, (err, result) => {
        if (err) {
        console.error(err);
        return res.status(500).json({ error: err.code });
        }
        if (result.affectedRows > 0) {
        return res.status(200).json({ messege: "Workspace deleted..." });
        } else {
        return res.status(404).json({ messege: "Nothing to delete." });
        }
    });
};

exports.createSurvey = (req, res) => {
  let sql = `INSERT INTO surveys (name, workspace_id) VALUES ('${req.body.surveyName}', '${req.params.id}')`;
  mysqldb.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
    return res.status(201).json({ messege: "Survey created succesfully" });
  });
};

exports.deleteSurvey = (req, res) => {
  let sql = `DELETE FROM surveys where id = ${req.body.surveyId} AND workspace_id = ${req.params.id}`;
  mysqldb.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
    console.log('sql'+ sql);
    console.log('result.affectedRows'+ result.affectedRows);
    if (result.affectedRows > 0) {
      return res.status(201).json({ messege: "Survey deleted succesfully" });
    } else {
      return res.status(404).json({ messege: "Nothing to delete..." });
    }
  });
};

exports.duplicateSurvey = (req, res) =>{
    req.body.surveyName += ' (copy)';
    let sql = `INSERT INTO surveys (name, workspace_id) VALUES ('${req.body.surveyName}', '${req.params.id}')`;
    mysqldb.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.code });
      }
      return res.status(201).json({ messege: "Survey created succesfully" });
    });

    //TODO duplicate all current survey elements to the duplicated one
}

exports.moveSurvey = (req, res) =>{

}

exports.getSurvey = (req, res) =>{
    let sql = `SELECT * FROM surveys WHERE survey_id = '${req.body.surveyId}' AND workspace_id = '${req.params.id}'`;
    mysqldb.query(sql, (err, result, fields) => {
        if (err) {
          throw err;
        }
        if (result.length > 0) {
            let survey = [];
            result.forEach((row) => {
                survey.push({
                ...row,
              });
            });
            return res.json(survey);
        } else {
          res.status(404).json({ messege: "Survey not found" });
        }
      });
}
