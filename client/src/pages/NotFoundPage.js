import React from 'react';
import {
  Link
} from 'react-router-dom';
import './css/NotFoundPage.scss';

const NotFoundPage = () => {
  
  return (
    <div id='notfound-root'>
      <div id='notfound-wrapper'>
        <h1 id='title'>404</h1>
        <h1 id='frowny'>:(</h1>
        <div id='notfound-content'>
          <p>The requested resource could not be found.</p><br />
          <p>(This isn't really an HTTP 404 status, it's just that there's no page matching your URL.)</p><br /><br />
          <p>Here are all of the routes you <b>can</b> go to:</p>

          <div id='valid-routes'>
            <ul>
              <li><Link to='/chat'>Chat lobby</Link></li>
              <li><Link to='/login'>Login</Link></li>
              <li><Link to='/register'>Register</Link></li>
              <li><Link to='/logout'>Logout</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;