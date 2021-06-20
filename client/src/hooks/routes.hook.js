import { Switch, Route, Redirect } from 'react-router-dom';
import {
	Home,
	Teachers,
	EditProfile,
	Teacher,
	Tasks,
	Task,
	PreviewTask,
	Main,
	Login,
	Signup,
} from '../pages';
import { Header, ScrollToTop } from '../Components';

export const useRoutes = (isAuthenticated) => {
	if (isAuthenticated) {
		return (
			<>
				<Header />
				<ScrollToTop />
				<Switch>
					<Route path='/home' component={Home} />
					<Route path='/teachers' component={Teachers} />
					<Route path='/editProfile' component={EditProfile} />
					<Route path='/tasks' component={Tasks} />
					<Route path='/task' component={Task} />
					<Route path='/previewTask' component={PreviewTask} />
					<Route path='/teacher/:id' component={Teacher} />
					<Redirect to='/home' />
				</Switch>
			</>
		);
	}

	return (
		<Switch>
			<Route exact path='/' component={Main} />
			<Route path='/login' component={Login} />
			<Route path='/signup' component={Signup} />
			<Redirect to='/' />
		</Switch>
	);
};
