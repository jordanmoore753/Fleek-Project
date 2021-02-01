import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MIN_PASSWORD_LENGTH = 5;
const MIN_EMAIL_LENGTH = 5;
const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Register = ({ onLogin, handleUpdateMessage }) => {
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

    if (isInvalid()) {
      return;
    }

    fetch('http://localhost/app/register', {
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
      handleUpdateMessage(err.msg, false)
      return;
    });
  };

  const validEmail = () => {
    return EMAIL_REGEXP.test(email.toLowerCase());
  };

  const isInvalid = () => {
    if (
      password.trim().length < password.length ||
      email.trim().length < email.length
    ) {
      handleUpdateMessage("Credentials can not contain spaces.", false);
      return true;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      handleUpdateMessage("Password must be at least 8 characters.", false);
      return true;
    }

    if (!validEmail()) {
      handleUpdateMessage("Invalid email.", false);
      return true;
    }

    return false;
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
            Register
          </button>
        </div>
      </div>
      <Link to="/login">Already have an account? Login instead.</Link>
    </div>
  );
};

export default Register;