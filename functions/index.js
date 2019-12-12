const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FBAuth');
const {
  postOneScream,
  getAllScreams,
  getSingleScream,
  commentOnScream
} = require('./handlers/screams');

const {
  signup,
  login,
  addUserDetails,
  getAuthenticatedUser,
  uploadImage
} = require('./handlers/users');

app.get('/screams', getAllScreams);
app.post('/screams', FBAuth, postOneScream);
app.get('/screams/:screamId', getSingleScream);
app.post('/screams/:screamId/comments', FBAuth, commentOnScream);

app.post('/signup', signup);
app.post('/login', login);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.post('/users/image', FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);