const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FBAuth');
const { postOneScream, getAllScreams } = require('./handlers/screams');
const { signup, login, uploadImage } = require('./handlers/users');

app.get('/screams', getAllScreams);
app.post('/screams', FBAuth, postOneScream);

app.post('/signup', signup);
app.post('/login', login);
app.post('/users/image', FBAuth, uploadImage)

exports.api = functions.https.onRequest(app);