import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';

const App = () => {
	const { login, logout, token, userId } = useAuth();
	const isAuthenticated = !!token;
	const routes = useRoutes(isAuthenticated);
	return (
		<div className='App'>
			<AuthContext.Provider
				value={{
					login,
					logout,
					token,
					userId,
					isAuthenticated,
				}}>
				<Router>{routes}</Router>
			</AuthContext.Provider>
		</div>
	);
};

export default App;
