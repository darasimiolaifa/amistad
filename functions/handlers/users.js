const firebase = require('firebase');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { db, admin } = require('../util/admin');
const config  = require('../util/config');
const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');

firebase.initializeApp(config);

exports.signup = async (req, res) => {
  try {
    const { body } = req;
    const newUser = { ...body }
    const { errors, valid } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);
    
    const document = await db.doc(`/users/${newUser.handle}`).get();
    if (document.exists) {
      return res.status(400).json({ handle: 'This handle is already taken.' });
    }
    const data = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
    const { user: { uid: userId } } = data;
    const token = await data.user.getIdToken();
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-img.png?alt=media`;
    const userCredentials = {
      email: newUser.email,
      handle: newUser.handle,
      createdAt: new Date().toISOString(),
      userId,
      imageUrl
    }
    await db.doc(`/users/${newUser.handle}`).set(userCredentials);
    return res.status(201).json({ token, message: `User ${userId} created successfully.` });
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({ email: error.message });
    }
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}

exports.login = async (req, res) => {
  try {
    const { body } = req;
    const user = { ...body };
    
    const { errors, valid } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);
    
    const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    const token = await data.user.getIdToken();
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ general: 'Wrong credentials. Please try again later.' });
  }
}

exports.addUserDetails = async (req, res) => {
  try {
    const userDetails = reduceUserDetails(req.body);
    await db.doc(`/users/${req.user.handle}`).update(userDetails);
    return res.status(200).json({ message: 'Details added successfully.'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}

exports.getUserDetails = async ({ params }, res) => {
  try {
    const userDetails = {};
    userDetails.screams = [];
    const { handle: userHandle } = params;
    const user = await db.doc(`users/${userHandle}`).get();
    if (user.exists) {
      userDetails.user = user.data();
    }
    const userScreams = await db.collection('screams').where('userHandle', '==', userHandle).orderBy('createdAt', 'desc').get();
    userScreams.forEach(scream => {
      userDetails.screams.push({
        screamId: scream.id,
        ...scream.data()
      });
    });
    
    return res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}

exports.getAuthenticatedUser = async ({ user }, res) => {
  const { handle: userHandle } = user;
  try {
    const userDetails = {};
    userDetails.likes = [];
    userDetails.notifications = [];
    
    const unresolvedUser  = db.doc(`/users/${userHandle}`).get();
    const unresolvedLikes = db.collection('likes').where('userHandle', '==', userHandle).get();
    const unresolvedNotifications = db.collection('notifications').where('receipient', '==', userHandle).orderBy('createdAt', 'desc').limit(10).get();
    
    const unresolvedPromises = [unresolvedUser, unresolvedLikes, unresolvedNotifications];    
    const [userDoc, likesDocs, notificationsDocs] = await Promise.all(unresolvedPromises);

    if (userDoc.exists) {
      userDetails.credentials = userDoc.data();
    }
    
    likesDocs.forEach(like => {
      userDetails.likes.push(like.data());
    });
    notificationsDocs.forEach(notification => {
      userDetails.notifications.push({
        ...notification.data(),
        notificationId: notification.id
      });
    });
    return res.status(200).json(userDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}

exports.uploadImage = async (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  let imageFileName;
  let imageToBeUploaded = {};
  try {
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedFileTypes.includes(mimetype)) {
        return res.status(400).json({ error: 'Wrong file type submitted.'});
      }
      const imageExtension = path.extname(filename);
      imageFileName = `${Math.round(Math.random() * 100000000000)}${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
      admin.storage().bucket().upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.status(200).json({ message: 'Image uploaded successfully.'});
      })
      .catch (error => {
        console.error(error);
      });
    });
    busboy.end(req.rawBody);  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

exports.markNotificationRead = async ({ body, user }, res) => {
  try {
    let batch = db.batch();
    const { notificationIds } = body;
    const { handle } = user;
    const userDoc = await db.collection('users').where('handle', '==', handle).limit(1).get();
    const userHandle = userDoc.docs[0].data().handle;
    for (const notificationId of notificationIds) {
      const notification = db.doc(`notifications/${notificationId}`);
      const notificationDoc = await notification.get();
      const { receipient } = notificationDoc.data();
      if (receipient !== userHandle) {
        return res.status(403).json({ error: 'One or more of the screams do not belong to you.'});
      } else {
        batch.update(notification, { read: true });
      }
    }
    await batch.commit();
    return res.status(200).json({ message: 'Notifications marked read.'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ general: 'Something went wrong. Please try again later.' });
  }
}