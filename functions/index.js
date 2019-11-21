const functions = require('firebase-functions');
const app = require('express')();

const { postOneScream, getAllScreams } = require('./handlers/screams');
const { signup, login } = require('./handlers/users');
const FBAuth = require('./util/FBAuth');

app.get('/screams', getAllScreams);
app.post('/screams', FBAuth, postOneScream);

app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);