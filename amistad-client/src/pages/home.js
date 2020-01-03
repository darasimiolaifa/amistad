import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/Scream";
import Profile from "../components/Profile";
import { getScreams } from "../redux/actions/dataActions";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getScreams(dispatch);
  }, []);

  const { screams, loading } = useSelector(state => ({
    ...state.data,
    ...state.ui,
    ...state.user
  }));
  const recentScreamsMarkup = !loading ? (
    screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    <p>Loading...</p>
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {recentScreamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

export default Home;
