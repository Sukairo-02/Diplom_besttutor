import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login, Signup } from './pages';

export const useRoutes = (isAuthenticated) => {
	if (isAuthenticated) {
		return <Switch></Switch>;
	}

	return (
		<Switch>
			<Route path='/login' component={Login} />
			<Route path='/signup' component={Signup} />
			<Redirect to='/login' />
		</Switch>
	);
};
