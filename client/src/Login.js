import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin, handleUpdateMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    const data = { email, password };
    
    fetch('http://localhost/app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    .then(res => {
      console.log(res);

      if (res.status !== 200) {
        handleUpdateMessage('Credentials did not pass.', false)
        return;
      }

      onLogin();
    })
    .catch(err => {
      handleUpdateMessage(err.msg, false);
    });
  };

  return (
    <div>
      <div className="field">
        <label className="label">Email</label>
        <div className="control has-icons-left">
          <input
            className="input"
            value={email}
            onChange={handleEmailChange}
            type="text"
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <label className="label">Password</label>
        <div className="control has-icons-left">
          <input
            className="input"
            value={password}
            onChange={handlePasswordChange}
            type="password"
          />
          <span className="icon is-small is-left">
            <i className="fas fa-key"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button className="button is-info" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
      <Link to="/register">Don't have an account? Register instead.</Link>
    </div>
  );
};

export default Login;