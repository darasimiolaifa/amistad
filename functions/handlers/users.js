const firebase = require('firebase');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { db, admin } = require('../util/admin');
const config  = require('../util/config');
const { validateSignupData, validateLoginData } = require('../util/validators');

firebase.initializeApp(config);

exports.signup = async (req, res) => {
  try {
    const { body } = req;
    const newUser = {
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
      handle: body.handle
    }
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
    return res.status(500).json({ error: error.code });
  }
}

exports.login = async (req, res) => {
  try {
    const { body } = req;
    const user = {
      email: body.email,
      password: body.password
    }
    
    const { errors, valid } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);
    
    const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    const token = await data.user.getIdToken();
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/user-not-found') return res.status(404).json({ error: 'This user does not exist in the records'});
    else if (error.code === 'auth/wrong-password') return res.status(403).json({ general: 'Invalid login credentials.'});
    return res.status(500).json({ error: error.code });
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
      });
    });
    busboy.end(req.rawBody);  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
}