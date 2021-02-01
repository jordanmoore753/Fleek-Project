import React from 'react';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleNewKey = (e) => {
    this.props.handleNewKey();
  };

  handleDisableKey = (e) => {
    this.props.handleDisableKey(e.target.id);
  };

  handleLogout = () => {
    this.props.handleLogout();
  };

  render() {
    return (
      <div className="container main-dash">
        <h1 className="title is-1">API Key Manager</h1>
        <div className="field mb-6">
          <div className="control">
            <div className="buttons">
              <button 
                className="button is-light"
                onClick={this.handleNewKey}
              >
                Generate API Key
              </button>
              <button
                className="button is-danger is-light"
                onClick={this.handleLogout}
              >
                Logout
              </button>
            </div>

          </div>
        </div>
        { this.props.keys.keys.length > 0 ? (
          <>
          {
            Object.keys(this.props.keys.requests).map(function(key) {
              const obj = this.props.keys.keys.find(k => k.id === Number(key));

              return (
                <div className="box">
                  <h1
                    className={obj.enabled ? 'api-key': 'disabled-api-key'}
                  >
                    {obj.value}
                    {obj.enabled && (
                    <button
                      className="button is-danger is-small inline-btn"
                      onClick={this.handleDisableKey}
                      id={obj.id}
                    >
                      Disable
                    </button>
                  )}
                  </h1>
                  <table className="table is-fullwidth">
                    <thead>
                      <tr>
                        <th>Request</th>
                        <th>Bytes</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.keys.requests[key].map(function(request) {
                        return (
                          <tr>
                            <td>{request.location}</td>
                            <td>{request.bytes}</td>
                            <td>{new Date(request.created_at).toDateString('YYYY-MM-DD')}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }, this)
          }    
          </>
        ) : (
          <p className="subtitle is-4">Create some keys.</p>
        )}
      </div>
    );
  }
}

export default Dashboard;