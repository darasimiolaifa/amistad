const { admin, db } = require('./admin');

module.exports = async (req, res, next) => {
  let idToken = '';
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.replace('Bearer ', '');
    } else {
      return res.status(403).json({ error: 'Unauthorized.' });
    }
    const decodedUser = await admin.auth().verifyIdToken(idToken);
    req.user = decodedUser;
    const data = await db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
    const { handle, imageUrl } = data.docs[0].data();
    req.user.handle = handle;
    req.user.imageUrl = imageUrl;
    return next();
  } catch (error) {
    console.log('Error while verifying token ', error);
    return res.status(403).json(error);
  }
}