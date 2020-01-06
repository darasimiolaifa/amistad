import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import withStyles from "@material-ui/core/styles/withStyles";
import { getSingleScream } from "../../redux/actions/dataActions";
import ChatIcon from "@material-ui/icons/Chat";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import MyButton from "../../util/myButton";
import Dialog from "@material-ui/core/Dialog";
import { Link } from "react-router-dom";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SET_ERRORS } from "../../redux/types";

const styles = theme => {
  return {
    ...theme.otherStyling,
    profileImage: {
      maxWidth: 200,
      height: 200,
      borderRadius: "50%",
      objectFir: "cover"
    },
    screamContent: {
      padding: 20
    },
    closeButton: {
      position: "absolute",
      top: "5%",
      left: "90%"
    },
    expandButton: {
      position: "absolute",
      left: "90%"
    },
    spinnerDiv: {
      textAlign: "center",
      maeginBottom: 50,
      marginTop: 50
    }
  };
};

const ScreamDialog = ({ classes, screamId }) => {
  const {
    scream: {
      body,
      createdAt,
      userImage,
      likeCount,
      commentCount,
      userHandle,
      comments
    },
    loading
  } = useSelector(state => ({ ...state.data }));
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
    getSingleScream(dispatch, screamId);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch({ type: SET_ERRORS, payload: { errors: {} } });
  };

  const expandedScream = loading ? (
    <div className={classes.spinnerDiv}>
      <CircularProgress size={200} thickness={2} />
    </div>
  ) : (
    <Grid container spacing={2}>
      <Grid item sm={5}>
        <img
          src={userImage}
          alt={userHandle}
          className={classes.profileImage}
        />
      </Grid>
      <Grid item sm={7}>
        <Typography
          component={Link}
          color="primary"
          to={`/users/${userHandle}`}
          variant="h5"
        >
          @{userHandle}
        </Typography>
        <hr className={classes.hiddenRule} />
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).format(`h:mm a, MMMM DD YYYY`)}
        </Typography>
        <hr className={classes.hiddenRule} />
        <Typography variant="body1">{body}</Typography>
        <LikeButton screamId={screamId} />
        <span>{likeCount} likes</span>
        <MyButton tip="comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount} comments</span>
      </Grid>
      <hr
        className={
          commentCount === 0 ? classes.hiddenRule : classes.visibleRule
        }
      />
      <CommentForm screamId={screamId} />
      <Comments comments={comments} />
    </Grid>
  );

  return (
    <Fragment>
      <MyButton
        tip="Expand scream"
        tipClassName={classes.expandButton}
        onClick={handleOpen}
      >
        <UnfoldMore color="primary" />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MyButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogContent className={classes.screamContent}>
          {expandedScream}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default withStyles(styles)(ScreamDialog);
