const { db } = require('../util/admin');

const likeNotificationHandler = async (snapshot) => {
  try {
    const scream = await db.doc(`screams/${snapshot.data().screamId}`).get();
    if (scream.exists) {
      await db.doc(`notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        screamId: scream.id,
        sender: snapshot.data().userHandle,
        receipient: scream.data().userHandle,
        type: 'like',
        read: false
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const commentNotificationHandler = async (snapshot) => {
  try {
    const scream = await db.doc(`screams/${snapshot.data().screamId}`).get();
    if (scream.exists) {
      await db.doc(`notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        screamId: scream.id,
        sender: snapshot.data().userHandle,
        receipient: scream.data().userHandle,
        type: 'comment',
        read: false
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const unlikeNotificationHandler = async (snapshot) => {
  try {
    await db.doc(`notifications/${snapshot.id}`).delete();
  } catch (error) {
    console.log(error);
  }
};

const changeUserImageHandler = async (change) => {
  try {
    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      const screams = await db.collection('screams').where('userHandle', '==', change.before.data().handle).get();
      screams.forEach(scream => {
        const oldScream = db.doc(`screams/${scream.id}`);
        batch.update(oldScream, { userImage: change.after.data().imageUrl });
      });
      await batch.commit();
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteScreamHandler = async (snapshot, { params }) => {
  try {
    const { screamId } = params;
    const batch = db.batch();
    
    const screamComments = await db.collection('comments').where('screamId', '==', screamId).get();
    screamComments.forEach(comment => {
      batch.delete(db.doc(`comments/${comment.id}`));
    });
    const screamLikes = await db.collection('likes').where('screamId', '==', screamId).get();
    screamLikes.forEach(like => {
      batch.delete(db.doc(`likes/${like.id}`));
    });
    const screamNotifications = await db.collection('notifications').where('screamId', '==', screamId).get();
    screamNotifications.forEach(notification => {
      batch.delete(db.doc(`notifications/${notification.id}`));
    });
    await batch.commit();
  } catch (error) {
    console.log(error);
  }
  
}

module.exports = {
  likeNotificationHandler,
  unlikeNotificationHandler,
  commentNotificationHandler,
  changeUserImageHandler,
  deleteScreamHandler
}