import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {
	Home,
	Subjects,
	Login,
	Signup,
	Teachers,
	EditProfile,
	Teacher,
	Tasks,
	Task,
	PreviewTask,
} from './pages';
import { Header } from './Components';

export const useRoutes = (isAuthenticated) => {
	if (isAuthenticated) {
		return (
			<>
				<Header />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/subjects' component={Subjects} />
					<Route path='/teachers' component={Teachers} />
					<Route path='/editProfile' component={EditProfile} />
					<Route path='/tasks' component={Tasks} />
					<Route path='/task' component={Task} />
					<Route path='/previewTask' component={PreviewTask} />
					<Route path='/teacher/:id' component={Teacher} />
					<Redirect to='/' />
				</Switch>
			</>
		);
	}

	return (
		<Switch>
			<Route path='/login' component={Login} />
			<Route path='/signup' component={Signup} />
			<Redirect to='/login' />
		</Switch>
	);
};
