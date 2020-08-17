import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { ChatPage } from './ChatPage.js';
import { LoginPage } from './LoginPage.js';

const App = (props) => {
  const { io } = props;
  
  return (
    <Router>
      <Switch>

        <Route exact path='/'>
          <Redirect to='/login' />
        </Route>

        <Route path='/login'>
          <LoginPage io={io} />
        </Route>

        <Route path='/chat'>
          <ChatPage io={io} />
        </Route>
        
      </Switch>
    </Router>
  );
};

export default App;