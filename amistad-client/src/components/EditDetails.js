import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { editUserDetails } from "../redux/actions/userActions";
import Button from "@material-ui/core/Button";
import MyButton from "../util/myButton";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  ...theme.otherStyling,
  button: {
    float: "right"
  }
});

const EditDetails = ({ classes }) => {
  const dispatch = useDispatch();
  const { credentials } = useSelector(state => ({
    ...state.user
  }));

  const [formDetails, setFormDetails] = useState({
    bio: credentials.bio ? credentials.bio : "",
    location: credentials.location ? credentials.location : "",
    website: credentials.website ? credentials.website : ""
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormDetails({ ...formDetails, [name]: value });
  };

  const handleSubmit = () => {
    editUserDetails(dispatch, formDetails);
    handleClose();
  };

  return (
    <Fragment>
      <MyButton
        tip="Edit details"
        onClick={handleOpen}
        btnClassName={classes.button}
      >
        <EditIcon color="primary" />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              type="text"
              name="bio"
              label="Bio"
              multiline
              rows="3"
              fullWidth
              className={classes.textField}
              placeholder="A short bio about yourself"
              value={formDetails.bio}
              onChange={handleChange}
            />
            <TextField
              type="text"
              name="location"
              label="Location"
              fullWidth
              className={classes.textField}
              placeholder="Where you live"
              value={formDetails.location}
              onChange={handleChange}
            />
            <TextField
              type="text"
              name="website"
              label="Website"
              fullWidth
              className={classes.textField}
              placeholder="Your personal/professional website"
              value={formDetails.website}
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default withStyles(styles)(EditDetails);
