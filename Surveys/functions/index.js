const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");
const WSAuth = require("./util/workspaceAuth");

const {
  getAllUsers,
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getSingleUser,
  changePassword,
  getAllUserWorkspaces
} = require("./handlers/users");

const {
  createWorkspace,
  renameWorkspace,
  deleteWorkspace,
  createSurvey,
  deleteSurvey,
  duplicateSurvey,
  moveSurvey,
  getSurvey,
} = require("./handlers/workspaces");

//Users Route
app.get("/users", FBAuth, getAllUsers);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:userId", getSingleUser);
app.get("/user/:userId/getAlluserWorkspaces",FBAuth, getAllUserWorkspaces);

app.post("/user", FBAuth, addUserDetails);
app.post("/signup", signup);
app.post("/login", login);

app.post("/user/image", FBAuth, uploadImage);
app.post("/user/changePassword", FBAuth, changePassword);

//Workspace Routh
app.post("/workspace/create", FBAuth, createWorkspace);
app.post("/workspace/:id/rename", FBAuth, WSAuth, renameWorkspace);
app.delete("/workspace/:id", FBAuth, WSAuth, deleteWorkspace);

//Survey Routh
app.post("/workspace/:id/survey/create", FBAuth, WSAuth, createSurvey);
app.post("/workspace/:id/survey/duplicate", FBAuth, WSAuth, duplicateSurvey);
app.post("workspace/:id/survey/move", FBAuth, WSAuth, moveSurvey);
app.get("/workspace/:id/survey/get", FBAuth, WSAuth, getSurvey);
app.delete("/workspace/:id/survey/delete", FBAuth, WSAuth, deleteSurvey);

//TODO: Duplicate Survey
//TODO: Move Survey
//Survey Route
//app.get('/survey/:surveyId', getSurvey)
//TODO: delete survey
//TODO: create survey
//app.post('/survey/create', FBAuth,createSurvey);

exports.api = functions.region("europe-west3").https.onRequest(app);
