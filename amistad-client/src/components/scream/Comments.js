import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const styles = theme => ({
  ...theme.otherStyling,
  commentImage: {
    width: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "50%"
  },
  commentData: {
    marginLeft: 20
  }
});

const Comments = ({ classes, comments }) => {
  return (
    <Grid container>
      {comments.map(({ body, createdAt, userImage, userHandle }, index) => {
        return (
          <Fragment key={createdAt}>
            <Grid item sm={12}>
              <Grid container>
                <Grid item sm={2}>
                  <img
                    src={userImage}
                    className={classes.commentImage}
                    alt={userHandle}
                  />
                </Grid>
                <Grid item sm={9}>
                  <div className={classes.commentData}>
                    <Typography
                      variant="h5"
                      component={Link}
                      to={`/users/${userHandle}`}
                      color="primary"
                    >
                      {userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(createdAt).format(`h:mm a, MMMM DD YYYY`)}
                    </Typography>
                    <hr className={classes.hiddenRule} />
                    <Typography variant="body1">{body}</Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            {index !== comments.length - 1 && (
              <hr className={classes.visibleRule} />
            )}
          </Fragment>
        );
      })}
    </Grid>
  );
};

export default withStyles(styles)(Comments);
