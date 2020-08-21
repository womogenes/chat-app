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
const LogoutPage = React.lazy(() => import('./pages/LogoutPage.js'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage.js'));

const App = () => {

  return (

    <Router>

      <Route exact path='/'>
        <Redirect to='/chat' />
      </Route>

      <Suspense fallback={
        <div id='loading-screen'><p>Loading...</p></div>
      }>
        <Switch>
          <Route path='/login' render={(props) => (<LoginPage {...props} />)} />
          <Route path='/chat' render={(props) => (<ChatPage {...props} />)} />
          <Route path='/register' component={RegisterPage} />
          <Route path='/logout' component={LogoutPage} />
          <Route path='/404' component={NotFoundPage} />
          <Redirect to='/404' />
        </Switch>
      </Suspense>

    </Router>
  );
};

export default App;