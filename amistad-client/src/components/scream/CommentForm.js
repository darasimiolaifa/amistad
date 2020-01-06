import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addComments } from "../../redux/actions/dataActions";

const styles = theme => ({
  ...theme.otherStyling
});

const CommentForm = ({ classes, screamId }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { authenticated, errors, isLoading } = useSelector(state => ({
    ...state.user,
    ...state.ui
  }));
  const handleChange = ({ target: { value } }) => setComment(value);
  const handleSubmit = event => {
    event.preventDefault();
    addComments(dispatch, screamId, { body: comment });
    setComment("");
  };
  const addCommentMarkup = authenticated ? (
    <Grid item sm={12} style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="comment"
          type="text"
          value={comment}
          label="Comment on scream"
          error={errors.comment ? true : false}
          helperText={errors.comment}
          onChange={handleChange}
          fullWidth
          className={classes.textField}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={isLoading}
        >
          Submit
          {isLoading && (
            <CircularProgress size={30} className={classes.progress} />
          )}
        </Button>
      </form>
    </Grid>
  ) : null;
  return addCommentMarkup;
};

export default withStyles(styles)(CommentForm);
