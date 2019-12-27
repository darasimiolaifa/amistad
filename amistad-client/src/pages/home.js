import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/Scream';

function Home() {
  const [screams, setScream] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: screams} = await axios.get('/screams');
      setScream(screams);
    }
    fetchData();
  });
  const recentScreamsMarkup = screams.length > 0 ? (screams.map(scream => <Scream key={scream.screamId} scream={scream} />)) : <p>Loading...</p>
  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
      {recentScreamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        <p>Profile...</p>
      </Grid>
    </Grid>
  )
}

export default Home;
