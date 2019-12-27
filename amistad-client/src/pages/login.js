import React, { useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import AppIcon from '../images/amistad-icon.png';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';


const styles = {
  form: {
    textAlign: 'center'
  },
  image: {
    margin: '20px auto 0 auto',
    width: '52px',
    height: '52px'
  },
  pageTitle: {
    margin: '10px auto 10px auto',
  },
  textField: {
    margin: '10px auto 10px auto',
  },
  button: {
    marginTop: 20,
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10
  }
}


function Login({ classes, history }) {
  const initialState = {
    email: '',
    password: '',
    isLoading: false,
    errors: {}
  };
  const [formValues, setFormValues] = useState(initialState);
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setFormValues({
        ...formValues,
        email: '',
        password: '',
        isLoading: true
      });
      const { data: token } = await axios.post('/login',
      {
        email: formValues.email,
        password: formValues.password
      });
      setFormValues({
        ...formValues,
        email: '',
        password: '',
        isLoading: false
      });
      history.push('/');
    } catch (error) {
      console.log(error.response.data);
      setFormValues({
        ...formValues,
        email: '',
        password: '',
        errors: error.response.data
      });
    }
  }
  const handleFocus = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name] : event.target.value,
      errors: {}
    });
  }
  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name] : event.target.value
    });
  }
  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt='App Icon' className={classes.image} />
        <Typography variant='h2' className={classes.pageTitle}>
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField id='email' name='email' type='email' label='Email' className={classes.textField} value={formValues.email} helperText={formValues.errors.email} error={formValues.errors.email ? true : false} onChange={handleChange} onFocus={handleFocus} fullWidth />
          <TextField id='password' name='password' type='password' label='Password' className={classes.textField} value={formValues.password} helperText={formValues.errors.password} error={formValues.errors.password ? true : false} onChange={handleChange} onFocus={handleFocus} fullWidth />
          {formValues.errors.general && (
            <Typography variant='body2' className={classes.customError}>
              {formValues.errors.general}
            </Typography>
          )}
          <Button type='submit' variant='contained' color='primary' className={classes.button} disabled={formValues.isLoading}>
            Login
            {formValues.isLoading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            Don't have an account? Sign up <Link to='/signup' className='nav-links'>here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  )
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login);
