import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/Scream";
import Profile from "../components/Profile";

const endpoint = "https://us-central1-amistad-9f94a.cloudfunctions.net/api";

const Home = () => {
  const [screams, setScream] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: screams } = await axios.get(`${endpoint}/screams`);
      setScream(screams);
    };
    fetchData();
  }, []);
  const recentScreamsMarkup =
    screams.length > 0 ? (
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
