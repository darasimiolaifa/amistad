const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp();

const app = express();

app.get('/screams', async (req, res) => {
  try {
    const data = await admin.firestore().collection('screams').orderBy('createdAt', 'desc').get();
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
    const doc = await admin.firestore().collection('screams').add({
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

exports.api = functions.https.onRequest(app);