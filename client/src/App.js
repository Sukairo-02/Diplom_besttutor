import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from './redux/reducers/userInfoSlice';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';
import { createAuthProvider } from './jwt';

const App = () => {
	const { useAuth } = createAuthProvider();
	const [logged] = useAuth();
	const isAuthenticated = !!logged;
	const routes = useRoutes(isAuthenticated);

	const dispatch = useDispatch();
	const info = useSelector((state) => state.userInfo.info);

	React.useEffect(() => {
		if (Object.keys(info).length === 0) {
			dispatch(fetchUserInfo());
		}
	});

	return (
		<div className='App'>
			<Router>{routes}</Router>
		</div>
	);
};

export default App;
