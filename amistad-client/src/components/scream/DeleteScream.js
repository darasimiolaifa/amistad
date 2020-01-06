import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import MyButton from "../../util/myButton";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { deleteScream } from "../../redux/actions/dataActions";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%"
  }
};

const DeleteScream = ({ screamId, classes }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleScreamDelete = () => {
    deleteScream(dispatch, screamId);
    setOpen(false);
  };

  return (
    <Fragment>
      <MyButton
        tip="Delete Scream"
        onClick={handleOpen}
        btnClassName={classes.deleteButton}
      >
        <DeleteOutline color="secondary" />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Are you sure you want to delete this scream?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleScreamDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default withStyles(styles)(DeleteScream);
