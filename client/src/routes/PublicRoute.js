import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({component: Component, isLoggedIn, ...rest}) => {
    return (
      <Route 
        {...rest} 
        render={props => ( isLoggedIn ? <Redirect to="/" /> : <Component onLogin={rest.onLogin} />)}        
      />
    );
};

export default PublicRoute;