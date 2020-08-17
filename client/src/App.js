import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css';
const ChatPage = React.lazy(() => import( './components/ChatPage.js'));
const LoginPage = React.lazy(() => import('./components/LoginPage.js'));

const App = () => {
  
  return (
    <Router>
      <Switch>

        <Route exact path='/'>
          <Redirect to='/login' />
        </Route>

        <Suspense fallback={<div>Loading...</div>}>
          <Route path='/login' component={LoginPage} />
          <Route path='/chat' component={ChatPage} />
        </Suspense>
        
      </Switch>
    </Router>
  );
};

export default App;