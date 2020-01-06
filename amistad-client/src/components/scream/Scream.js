import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";
import MyButton from "../../util/myButton";
import DeleteScream from "./DeleteScream";

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
    authenticated,
    credentials: { handle }
  } = useSelector(state => ({ ...state.user }));

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
        <LikeButton screamId={screamId} />
        <span>{likeCount} likes</span>
        <MyButton tip="comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount} comments</span>
        <ScreamDialog screamId={screamId} userHandle={userHandle} />
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(Scream);
