import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Authentication from './Authentication';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './Dashboard';

import "bulma/css/bulma.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      keys: { keys: [], requests: {} },
      intervalID: null
    };
  }

  componentDidMount() {
    const id = setInterval(() => {
      this.getKeys();
    }, 5000);

    this.getKeys();

    this.setState({ intervalID: id });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoggedIn !== this.state.isLoggedIn) {
      this.getKeys();    
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalID);
    this.setState({ intervalID: null });
  }

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  };

  handleLogout = () => {
    fetch('http://localhost/app/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => {
      this.setState({ isLoggedIn: false });
    })
    .catch(e => {
      return e;
    })
  };

  handleNewKey = () => {
    const uuid = uuidv4();

    fetch('http://localhost/app/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey: uuid }),
      credentials: 'include'
    })
    .then(res => {
      if (res.status !== 200) {
        return;
      } else {
        this.getKeys();
      }
    })
    .catch(err => {
      return err;
    });
  };

  handleDisableKey = (id) => {
    const result = window.confirm("Would you like to disable this API Key? This action is irreversible.")

    if (!result) {
      return;
    }

    fetch('http://localhost/app/keys/disable', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keyId: id }),
      credentials: 'include'
    })
    .then(res => {
      this.getKeys();
    })
    .catch(err => {
      return err;
    });
  };

  getKeys = () => {
    fetch('http://localhost/app/keys', {
      credentials: 'include'
    })
    .then(res => {
      if (res.status !== 200) {
        return null;
      } else {
        return res.json();
      }
    })
    .then(json => {
      if (!json) {
        return;
      }

      this.setState({ keys: json, isLoggedIn: true });
      return;
    })
    .catch(err => {
      return err;
    });   
  };

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <PublicRoute 
              component={Authentication}
              onLogin={this.handleLogin}
              isLoggedIn={this.state.isLoggedIn}
              path="/login"
            />
            <PublicRoute 
              component={Authentication}
              onLogin={this.handleLogin}
              isLoggedIn={this.state.isLoggedIn}
              path="/register"
            />
            <ProtectedRoute 
              component={Dashboard}
              path="/"
              handleLogout={this.handleLogout}
              handleNewKey={this.handleNewKey}
              handleDisableKey={this.handleDisableKey}
              isLoggedIn={this.state.isLoggedIn}
              keys={this.state.keys}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
