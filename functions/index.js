const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const app = require('express')();

admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyDqglVH8NEhhBUeIoI1urDNS52B_fhTp0g",
  authDomain: "amistad-9f94a.firebaseapp.com",
  databaseURL: "https://amistad-9f94a.firebaseio.com",
  projectId: "amistad-9f94a",
  storageBucket: "amistad-9f94a.appspot.com",
  messagingSenderId: "1088613517092",
  appId: "1:1088613517092:web:763fda8d6a29fa82"
};

firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', async (req, res) => {
  try {
    const data = await db.collection('screams').orderBy('createdAt', 'desc').get();
    let screams = [];
    data.forEach(doc => {
      screams.push({
        screamId: doc.id,
        userhandle: doc.data().userhandle,
        body: doc.data().body,
        createdAt: doc.data().createdAt
      });
    });
    return res.json(screams);
  } catch(err) {
    console.error(err);
  }
});

app.post('/screams', async (req, res) => {
  try {
    const { body: { userhandle, body } } = req;
    const doc = await db.collection('screams').add({
      userhandle,
      body,
      createdAt: new Date().toISOString() 
    });
    return res.json({ message: `Document ${doc.id} created successfully.`});
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong'});
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { body } = req;
    const newuser = {
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
      handle: body.handle
    }
    const document = await db.doc(`/users/${newuser.handle}`).get();
    if (document.exists) {
      return res.status(400).json({ handle: 'This handle is already taken.' });
    }
    const data = await firebase.auth().createUserWithEmailAndPassword(newuser.email, newuser.password);
    const { user: { uid: userId } } = data;
    const token = await data.user.getIdToken();
    const userCredentials = {
      email: newuser.email,
      handle: newuser.handle,
      createdAt: new Date().toISOString(),
      userId
    }
    await db.doc(`/users/${newuser.handle}`).set(userCredentials);
    return res.status(201).json({ token, message: `User ${userId} created successfully.` });
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({ email: error.message });
    }
    return res.status(500).json({ error: error.code });
  }
});

exports.api = functions.https.onRequest(app);