import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { fetchUserInfo } from './redux/reducers/userInfoSlice';
import { getUserInfo } from './redux/selectors';
import { useRoutes } from './hooks/routes.hook';
import { createAuthProvider } from './jwt';
import { Loader, Notifications } from './Components';

const App = () => {
	const { useAuth } = createAuthProvider();
	const logged = useAuth();
	const isAuthenticated = !!logged;
	const routes = useRoutes(isAuthenticated);

	const dispatch = useDispatch();
	const info = useSelector(getUserInfo);

	React.useEffect(() => {
		if (Object.keys(info).length === 0 && logged) {
			dispatch(fetchUserInfo());
		}
	});

	return (
		<div className='App'>
			<Notifications />
			{Object.keys(info).length === 0 && logged ? (
				<Loader text='Загрузка данных пользователя' />
			) : (
				<Router>{routes}</Router>
			)}
		</div>
	);
};

export default App;
