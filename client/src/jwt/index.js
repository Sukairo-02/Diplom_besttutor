export const createTokenProvider = () => {
	let _token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH')) || null;

	const getExpirationDate = (jwtToken) => {
		if (!jwtToken) {
			return null;
		}

		const jwt = JSON.parse(atob(jwtToken.split('.')[1]));

		return (jwt && jwt.exp && jwt.exp * 1000) || null;
	};

	const isExpired = (exp) => {
		if (!exp) {
			return false;
		}

		return Date.now() > exp;
	};

	const getToken = async () => {
		if (!_token.token) {
			return null;
		}

		if (isExpired(getExpirationDate(_token.token))) {
			const updateToken = await fetch('/api/auth/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refreshToken: _token.refreshToken }),
			}).then((r) => r.json());

			setToken({
				token: updateToken.token,
				refreshToken: _token.refreshToken,
			});
		}

		return _token && _token.token;
	};

	const isLoggedIn = () => {
		return !!_token;
	};

	const setToken = (token) => {
		if (token) {
			localStorage.setItem('REACT_TOKEN_AUTH', JSON.stringify(token));
		} else {
			localStorage.removeItem('REACT_TOKEN_AUTH');
		}
		_token = token;
	};

	return {
		getToken,
		isLoggedIn,
		setToken,
	};
};

export const createAuthProvider = () => {
	const tokenProvider = createTokenProvider();

	const login = (newTokens) => {
		tokenProvider.setToken(newTokens);
	};

	const logout = () => {
		tokenProvider.setToken(null);
	};

	const authFetch = async (url, method = 'GET', body = null, headers = {}) => {
		const token = await tokenProvider.getToken();

		headers['Authorization'] = `Bearer ${token}`;

		if (body) {
			body = JSON.stringify(body);
			headers['Content-Type'] = 'application/json';
		}

		const response = await fetch(url, { method, body, headers });
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Что-то пошло не так');
		}

		return data;
	};

	const useAuth = () => {
		return tokenProvider.isLoggedIn();
	};

	return {
		useAuth,
		authFetch,
		login,
		logout,
	};
};
