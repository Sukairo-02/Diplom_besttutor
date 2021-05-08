import React, { useCallback } from 'react';

export const useAuth = () => {
	const [token, setToken] = React.useState(null);
	const [refreshToken, setRefreshToken] = React.useState(null);
	const [userId, setUserId] = React.useState(null);
	const [loader, setLoader] = React.useState(false);

	const login = React.useCallback((jwtToken, refreshToken, id) => {
		setToken(jwtToken);
		setRefreshToken(refreshToken);
		setUserId(id);

		localStorage.setItem(
			'userData',
			JSON.stringify({
				token: jwtToken,
				refreshToken: refreshToken,
				userId: id,
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setRefreshToken(null);
		setUserId(null);

		localStorage.removeItem('userData');
	}, []);

	React.useEffect(() => {
		const data = JSON.parse(localStorage.getItem('userData'));

		if (data && data.token) {
			login(data.token, data.refreshToken, data.userId);
		}

		setLoader(true);
	}, [login]);

	return { login, logout, token, refreshToken, userId, loader };
};
