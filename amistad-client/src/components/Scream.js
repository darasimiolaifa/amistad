import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import MyButton from "../util/myButton";
import DeleteScream from "./DeleteScream";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
    position: "relative"
  },
  content: {
    padding: 25
  },
  image: {
    minWidth: 200,
    objectFit: "cover"
  }
};

const Scream = ({
  classes,
  scream: {
    body,
    createdAt,
    userImage,
    likeCount,
    commentCount,
    userHandle,
    screamId
  }
}) => {
  const {
    likes,
    authenticated,
    credentials: { handle }
  } = useSelector(state => ({ ...state.user }));
  const dispatch = useDispatch();

  // check if logged in user likes this scream
  const likedScream =
    likes && likes.find(like => like.screamId === screamId) ? true : false;

  const doLikeScream = () => likeScream(dispatch, screamId);
  const doUnlikeScream = () => unlikeScream(dispatch, screamId);

  const likeButton = !authenticated ? (
    <MyButton tip="Like">
      <Link to="/login">
        <FavoriteBorder color="primary" />
      </Link>
    </MyButton>
  ) : !likedScream ? (
    <MyButton tip="Like" onClick={doLikeScream}>
      <FavoriteBorder color="primary" />
    </MyButton>
  ) : (
    <MyButton tip="Unlike" onClick={doUnlikeScream}>
      <FavoriteIcon color="primary" />
    </MyButton>
  );
  const deleteButton =
    authenticated && userHandle === handle ? (
      <DeleteScream screamId={screamId} />
    ) : null;
  dayjs.extend(relativeTime);
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image={userImage}
        title={userHandle}
        component={Link}
        to={`/users/${userHandle}`}
      />
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          color="primary"
          component={Link}
          to={`/users/${userHandle}`}
        >
          {userHandle}
        </Typography>
        {deleteButton}
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        {likeButton}
        <span>{likeCount} likes</span>
        <MyButton tip="comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount} comments</span>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(Scream);
