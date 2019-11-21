const { db } = require('../util/admin');

exports.postOneScream = async (req, res) => {
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
}

exports.getAllScreams = async (req, res) => {
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
}