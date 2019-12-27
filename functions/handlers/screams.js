const { db } = require('../util/admin');

exports.postOneScream = async ({ body, user }, res) => {
  try {
    const { body: screamBody } = body;
    const { handle: userHandle, imageUrl: userImage } = user;
    const newScream = {
      userHandle,
      body: screamBody,
      userImage,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString() 
    }
    const doc = await db.collection('screams').add(newScream);
    const responseScream = newScream;
    responseScream.screamId = doc.id;
    return res.status(201).json(responseScream);
  } catch(err) {
    console.error(err);
    return res.status(500).json({ general: 'Something went wrong. Please try again later.'});
  }
}

exports.getAllScreams = async (req, res) => {
  try {
    const data = await db.collection('screams').orderBy('createdAt', 'desc').get();
    let screams = [];
    data.forEach(doc => {
      screams.push({
        ...doc.data(),
        screamId: doc.id,
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
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
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
    await scream.ref.update({ commentCount: scream.data().commentCount + 1 });
    await db.collection('comments').add(newComment);
    return res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}

exports.likeScream = async ({ params, user }, res) => {
  try {
    const { handle: userHandle } = user;
    const { screamId } = params;
    const likeDocument = await db.collection('likes')
      .where('userHandle', '==', userHandle)
      .where('screamId', '==', screamId)
      .limit(1)
      .get();
    
    const screamCollection = await db.doc(`screams/${screamId}`);
    let screamDocument = await screamCollection.get();
    if (screamDocument.exists) {
      const screamData = screamDocument.data();
      screamData.screamId = screamDocument.id;
      if (likeDocument.empty) {
        await db.collection('likes').add({
          screamId,
          userHandle
        });
        screamData.likeCount++;
        await screamCollection.update({ likeCount: screamData.likeCount });
        return res.status(200).json(screamData);
      } else {
        return res.status(400).json({ error: 'Scream is already liked.' });
      }
    }
  } catch (error) {
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}
exports.unlikeScream = async ({ params, user }, res) => {
  try {
    const { handle: userHandle } = user;
    const { screamId } = params;
    const likeDocument = await db.collection('likes')
      .where('userHandle', '==', userHandle)
      .where('screamId', '==', screamId)
      .limit(1)
      .get();
    
    const screamCollection = await db.doc(`screams/${screamId}`);
    let screamDocument = await screamCollection.get();
    if (screamDocument.exists) {
      const screamData = screamDocument.data();
      screamData.screamId = screamDocument.id;
      if (likeDocument.empty) {
        return res.status(400).json({ error: 'Scream has not been liked.' });
      } else {
        await db.doc(`likes/${likeDocument.docs[0].id}`).delete();
        screamData.likeCount--;
        await screamCollection.update({ likeCount: screamData.likeCount });
        return res.status(200).json(screamData);
      }
    }
  } catch (error) {
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}

exports.deleteScream = async ({ params, user }, res) => {
  try {  const { handle: userHandle } = user;
    const { screamId } = params;
    const screamDocument = await db.doc(`screams/${screamId}`).get();
    if(!screamDocument.exists) {
      return res.status(404).json({ error: 'Scream not found' });
    }
    if(screamDocument.data().userHandle !== userHandle) {
      return res.status(403).json({ error: 'Unauthorized.' });
    } else {
      await screamDocument.ref.delete();
      return res.status(200).json({ message: 'Scream deleted successfully.' });
    }
  } catch (error) {
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}