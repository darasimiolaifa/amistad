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

module.exports = {
  likeNotificationHandler,
  unlikeNotificationHandler,
  commentNotificationHandler
}