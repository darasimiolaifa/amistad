import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import './App.css';

//Components
import Navbar from './components/Navbar';
// Pages
import home from './pages/home';
import signup from './pages/signup';
import login from './pages/login';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      dark: '#008394',
      main: '#00bcd4',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      dark: '#ff3d00',
      main: '#b22a00',
      contrastText: '#fff'
    }
  }
})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <Route exact path="/signup" component={signup} />
              <Route exact path="/login" component={login} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
