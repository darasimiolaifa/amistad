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
const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
}
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
}
const emptyErrorMessage = 'Must not be empty';
let idToken = '';
const FBAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.replace('Bearer ', '');
    } else {
      return res.status(403).json({ error: 'Unauthorized.' });
    }
    const decodedUser = await admin.auth().verifyIdToken(idToken);
    console.log(decodedUser);
    req.user = decodedUser;
    const data = await db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
    req.user.handle = data.docs[0].data().handle;
    return next();
  } catch (error) {
    console.log('Error while verifying token ', error);
    return res.status(403).json(error);
  }
}

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

app.post('/screams', FBAuth, async (req, res) => {
  try {
    const { body: { body } } = req;
    const { user: { handle: userHandle } } = req;
    const doc = await db.collection('screams').add({
      userHandle,
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
    const newUser = {
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
      handle: body.handle
    }
    let errors = {};
    
    if (isEmpty(newUser.email)) errors.email = emptyErrorMessage;
    else if (!isEmail(newUser.email)) errors.email = 'Must be a valid email';
    if(isEmpty(newUser.password)) errors.password = emptyErrorMessage;
    else if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match.'
    if (isEmpty(newUser.handle)) errors.handle = emptyErrorMessage;
    
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    
    const document = await db.doc(`/users/${newUser.handle}`).get();
    if (document.exists) {
      return res.status(400).json({ handle: 'This handle is already taken.' });
    }
    const data = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
    const { user: { uid: userId } } = data;
    const token = await data.user.getIdToken();
    const userCredentials = {
      email: newUser.email,
      handle: newUser.handle,
      createdAt: new Date().toISOString(),
      userId
    }
    await db.doc(`/users/${newUser.handle}`).set(userCredentials);
    return res.status(201).json({ token, message: `User ${userId} created successfully.` });
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({ email: error.message });
    }
    return res.status(500).json({ error: error.code });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { body } = req;
    let errors = {};
    const user = {
      email: body.email,
      password: body.password
    }
    
    if (isEmpty(user.email)) errors.email = emptyErrorMessage;
    if (isEmpty(user.password)) errors.password = emptyErrorMessage;
    if (Object.keys(errors).length > 0) return res.status(400).json(errors)
    
    const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    const token = await data.user.getIdToken();
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/user-not-found') return res.status(404).json({ error: 'This user does not exist in the records'});
    else if (error.code === 'auth/wrong-password') return res.status(403).json({ general: 'Invalid login credentials.'});
    return res.status(500).json({ error: error.code });
  }
});

exports.api = functions.https.onRequest(app);