import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { postScream } from "../../redux/actions/dataActions";
import Button from "@material-ui/core/Button";
import MyButton from "../../util/myButton";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  ...theme.otherStyling,
  submitButton: {
    position: "relative",
    float: "right",
    marginTop: "10%"
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "2%"
  }
});

const PostScream = ({ classes }) => {
  const { isLoading, errors } = useSelector(state => ({ ...state.ui }));
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = ({ target: { value } }) => {
    setBody(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    postScream(dispatch, { body });
    handleClose();
  };
  return (
    <Fragment>
      <MyButton tip="Post a Scream!" onClick={handleOpen}>
        <AddIcon />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MyButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogTitle>Post a new Scream</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              type="text"
              name="body"
              label="Scream"
              multiline
              rows="3"
              placeholder="Scream at your amigos"
              className={classes.textField}
              error={errors.body ? true : false}
              helperText={errors.body}
              onChange={handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={isLoading}
            >
              Submit
              {isLoading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default withStyles(styles)(PostScream);
