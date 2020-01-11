const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");

app.use(cors());

const FBAuth = require("./util/FBAuth");

const {
  postOneScream,
  getAllScreams,
  getSingleScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("./handlers/screams");

const {
  signup,
  login,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationRead,
  uploadImage
} = require("./handlers/users");

const {
  likeNotificationHandler,
  unlikeNotificationHandler,
  commentNotificationHandler,
  changeUserImageHandler,
  deleteScreamHandler
} = require("./handlers/dbTriggers");

app.get("/", (req, res) =>
  res
    .status(200)
    .json({
      status: 200,
      message:
        "Welcome to Amistad. Check out the API speck at https://github.com/darasimiolaifa/amistad"
    })
);

app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);
app.get("/screams/:screamId", getSingleScream);
app.delete("/screams/:screamId", FBAuth, deleteScream);
app.post("/screams/:screamId/comments", FBAuth, commentOnScream);
app.get("/screams/:screamId/like", FBAuth, likeScream);
app.get("/screams/:screamId/unlike", FBAuth, unlikeScream);

app.post("/signup", signup);
app.post("/login", login);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.post("/users/image", FBAuth, uploadImage);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationRead);

exports.api = functions.https.onRequest(app);
exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate(likeNotificationHandler);
exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete(unlikeNotificationHandler);
exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate(commentNotificationHandler);
exports.onUserImageChange = functions.firestore
  .document("users/{userId}")
  .onUpdate(changeUserImageHandler);
exports.onScreamDelete = functions.firestore
  .document("screams/{screamId}")
  .onDelete(deleteScreamHandler);
