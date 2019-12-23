import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

//Components
import Navbar from './components/Navbar';
// Pages
import home from './pages/home';
import signup from './pages/signup';
import login from './pages/login';


function App() {
  return (
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
  );
}

export default App;
