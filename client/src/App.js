import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';
import { createAuthProvider } from './jwt';

const App = () => {
	const { useAuth } = createAuthProvider();
	const [logged] = useAuth();
	const isAuthenticated = !!logged;
	const routes = useRoutes(isAuthenticated);

	return (
		<div className='App'>
			<Router>{routes}</Router>
		</div>
	);
};

export default App;
