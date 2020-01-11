import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/scream/Scream";
import ScreamSkeleton from "../util/ScreamSkeleton";
import StaticProfile from "../components/profile/StaticProfile";
import { getUserDetails } from "../redux/actions/dataActions";
import ProfileSkeleton from "../util/ProfileSkeleton";

const User = ({
  match: {
    params: { handle, screamId }
  }
}) => {
  const [profile, setProfile] = useState(null);
  const [screamIdParam, setScreamIdParam] = useState(null);
  const dispatch = useDispatch();
  const { screams, userLoading } = useSelector(state => ({
    ...state.data,
    ...state.ui
  }));

  useEffect(() => {
    getUserDetails(dispatch, handle);
    const userProfile = async () => {
      if (screamId) setScreamIdParam(screamId);
      try {
        const {
          data: { user }
        } = await axios.get(`https://us-central1-amistad-9f94a.cloudfunctions.net/api/user/${handle}`);
        setProfile(user);
      } catch (error) {
        console.log(error);
      }
    };

    userProfile();
  }, [dispatch, handle, screamId]);

  const screamsMarkup = userLoading ? (
    <ScreamSkeleton />
  ) : screams.length === 0 ? (
    <p>No screams from this user</p>
  ) : !screamIdParam ? (
    screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    screams.map(scream => {
      if (scream.screamId !== screamIdParam)
        return <Scream key={scream.screamId} scream={scream} />;
      else return <Scream key={scream.screamId} scream={scream} openDialog />;
    })
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {screamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profile === null ? (
          <ProfileSkeleton />
        ) : (
          <StaticProfile profile={profile} />
        )}
      </Grid>
    </Grid>
  );
};

export default User;
