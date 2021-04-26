import React, { useCallback } from 'react';

export const useAuth = () => {
	const [token, setToken] = React.useState(null);
	const [userId, setUserId] = React.useState(null);

	const login = React.useCallback((jwtToken, id) => {
		setToken(jwtToken);
		setUserId(id);

		localStorage.setItem(
			'userData',
			JSON.stringify({
				token: jwtToken,
				userId: id,
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUserId(null);

		localStorage.removeItem('userData');
	}, []);

	React.useEffect(() => {
		const data = JSON.parse(localStorage.getItem('userData'));

		if (data && data.token) {
			login(data.token, data.userId);
		}
	}, [login]);

	return { login, logout, token, userId };
};
