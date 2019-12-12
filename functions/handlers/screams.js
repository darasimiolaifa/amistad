const { db } = require('../util/admin');

exports.postOneScream = async ({ body, user }, res) => {
  try {
    const { body: screamBody } = body;
    const { handle: userHandle } = user;
    const doc = await db.collection('screams').add({
      userHandle,
      body: screamBody,
      createdAt: new Date().toISOString() 
    });
    return res.status(201).json({ message: `Document ${doc.id} created successfully.`});
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
    return res.status(200).json(screams);
  } catch(err) {
    console.error(err);
  }
}

exports.getSingleScream = async ({ params }, res) => {
  try {
    const { screamId } = params;
    let screamData = {};
    let comments = [];
    const screamDoc = await db.doc(`/screams/${screamId}`).get();
    if (!screamDoc.exists) {
      return res.status(404).json({ error: 'Scream does not exist.'});
    }
    screamData = screamDoc.data();
    screamData.screamId = screamDoc.id;
    const commentsDoc = await db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', screamId).get();
    commentsDoc.forEach(comment => {
      comments.push(comment.data());
    });
    screamData.comments = comments;
    return res.status(200).json(screamData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}

exports.commentOnScream = async ({ body, user, params }, res) => {
  try {
    const { body: comment } = body;
    const { handle, imageUrl } = user;
    const { screamId } = params;
    if (comment.trim() === '') return res.status(400).json({ comment: 'Must not be empty'});
    const newComment ={
      body: comment,
      createdAt: new Date().toISOString(),
      userHandle: handle,
      userImage: imageUrl,
      screamId
    }
    const scream = await db.doc(`/screams/${screamId}`).get();
    if (!scream.exists) return res.status(404).json({ error: 'Scream does not exist.'});
    await db.collection('comments').add(newComment);
    return res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}