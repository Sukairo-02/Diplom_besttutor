import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Home, Login, Signup } from './pages';

export const useRoutes = (isAuthenticated) => {
	if (isAuthenticated) {
		return (
			<Switch>
				<Route exact path='/' component={Home} />
				<Redirect to='/' />
			</Switch>
		);
	}

	return (
		<Switch>
			<Route exact path='/login' component={Login} />
			<Route exact path='/signup' component={Signup} />
			<Redirect to='/login' />
		</Switch>
	);
};
