import React, { useState } from 'react';

import Notification from './Notification';
import Login from './Login';
import Register from './Register';

const Authentication = ({ onLogin }) => {
  const isLogin = window.location.pathname === '/login';
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleNotificationRemove = () => {
    setMessage('');
  };

  const handleNotificationUpdate = (message, success) => {
    setMessage(message);
    setSuccess(success);
  };

  return (
    <div className="columns is-centered bkgrd">
      <div className="column is-one-third vertical-center">
        <h1 className="title is-1 mb-6">IPFS Manager</h1>
        <div className="box" style={{ textAlign: 'left'}}>
          <h1 className="title is-2">{
            isLogin ? ('Login') : ('Register')
          }</h1>
          { message.length === 0 ? (
            null
            ) : (<Notification 
            message={message}
            success={success}
            removeNotification={handleNotificationRemove}
          />)}
          { isLogin ? (
            <Login 
              onLogin={onLogin}
              handleUpdateMessage={handleNotificationUpdate}
            />
          ) : (
            <Register 
              handleUpdateMessage={handleNotificationUpdate}
              onLogin={onLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;