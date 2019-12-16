const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FBAuth');
const {
  postOneScream,
  getAllScreams,
  getSingleScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
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
app.delete('/screams/:screamId', FBAuth, deleteScream);
app.post('/screams/:screamId/comments', FBAuth, commentOnScream);
app.get('/screams/:screamId/like', FBAuth, likeScream);
app.get('/screams/:screamId/unlike', FBAuth, unlikeScream);

app.post('/signup', signup);
app.post('/login', login);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.post('/users/image', FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);