import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/scream/Scream";
import StaticProfile from "../components/profile/StaticProfile";
import { getUserDetails } from "../redux/actions/dataActions";

const User = ({
  match: {
    params: { handle }
  }
}) => {
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();
  const { screams, userLoading } = useSelector(state => ({
    ...state.data,
    ...state.ui
  }));

  useEffect(() => {
    getUserDetails(dispatch, handle);
    const userProfile = async () => {
      try {
        const {
          data: { user }
        } = await axios.get(`/user/${handle}`);
        setProfile(user);
      } catch (error) {
        console.log(error);
      }
    };

    userProfile();
  }, []);

  const screamsMarkup = userLoading ? (
    <p>Loading data...</p>
  ) : screams.length === 0 ? (
    <p>No screams from this user</p>
  ) : (
    screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {screamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profile === null ? (
          <p>Loading Profile data</p>
        ) : (
          <StaticProfile profile={profile} />
        )}
      </Grid>
    </Grid>
  );
};

export default User;
