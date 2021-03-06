import React, { Fragment } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import MyButton from "../../util/myButton";
import CalendarToday from "@material-ui/icons/CalendarToday";
import {
  logoutUser,
  uploadProfileImage
} from "../../redux/actions/userActions";
import EditDetails from "./EditDetails";
import ProfileSkeleton from "../../util/ProfileSkeleton";

const styles = theme => ({
  ...theme.otherStyling
});

const Profile = ({ classes }) => {
  const dispatch = useDispatch();
  const {
    credentials: { handle, createdAt, imageUrl, bio, website, location },
    loading,
    authenticated
  } = useSelector(state => ({ ...state.user }));

  const handleImageChange = ({ target: { files } }) => {
    const [image] = files;
    const formData = new FormData();
    formData.append("image", image, image.name);
    uploadProfileImage(dispatch, formData);
  };

  const handleEditPicture = () => {
    const fileinput = document.getElementById("imageInput");
    fileinput.click();
  };

  const handleLogout = () => {
    logoutUser(dispatch);
  };

  return !loading ? (
    authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt={handle} className="profile-image" />
            <input
              type="file"
              id="imageInput"
              hidden="hidden"
              onChange={handleImageChange}
            />
            <MyButton
              tip="Edit profile picture"
              onClick={handleEditPicture}
              btnClassName="button"
            >
              <EditIcon color="primary" />
            </MyButton>
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/user/${handle}`}
              color="primary"
              variant="h5"
            >
              @{handle}
            </MuiLink>
            <hr />
            {bio && (
              <Fragment>
                <Typography variant="body2">{bio}</Typography>
                <hr />
              </Fragment>
            )}
            {location && (
              <Fragment>
                <LocationOn color="primary" /> <span>{location}</span>
                <hr />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {" "}
                  {website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />{" "}
            <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
          <MyButton tip="Logout" onClick={handleLogout}>
            <KeyboardReturn color="primary" />
          </MyButton>
          <EditDetails />
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found. Please login again
        </Typography>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={"/login"}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to={"/signup"}
          >
            Signup
          </Button>
        </div>
      </Paper>
    )
  ) : (
    <ProfileSkeleton />
  );
};

export default withStyles(styles)(Profile);
