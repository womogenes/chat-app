import React, {
  Suspense
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css';
const ChatPage = React.lazy(() => import( './pages/ChatPage.js'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.js'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage.js'));

const App = () => {

  const changeAuthToken = (token) => {
    localStorage.setItem('authToken', token);
  }

  return (

    <Router>

      <Switch>

        <Route exact path='/'>
          <Redirect to='/login' />
        </Route>

        <Suspense fallback={
          <div id='loading-screen'><p>Loading...</p></div>
        }>
          <Route path='/login' render={(props) => (<LoginPage {...props} setAuthToken={changeAuthToken} />)} />
          <Route path='/chat' render={(props) => (<ChatPage {...props} />)} />
          <Route path='/register' component={RegisterPage} />
        </Suspense>
        
      </Switch>
    </Router>
  );
};

export default App;