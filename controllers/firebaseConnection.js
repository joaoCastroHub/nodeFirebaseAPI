var admin = require("firebase-admin");
var serviceAccount = require("../../justdoit-2017-firebase-adminsdk-5x949-9f090a0d3e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://justdoit-2017.firebaseio.com/"
});

// var db = admin.database();

module.exports = function () {
  return admin;
}