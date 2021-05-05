import { useState, useEffect } from 'react';

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

	let observers = [];

	const subscribe = (observer) => {
		observers.push(observer);
	};

	const unsubscribe = (observer) => {
		observers = observers.filter((_observer) => _observer !== observer);
	};

	const notify = () => {
		const isLogged = isLoggedIn();
		observers.forEach((observer) => observer(isLogged));
	};

	const setToken = (token) => {
		if (token) {
			localStorage.setItem('REACT_TOKEN_AUTH', JSON.stringify(token));
		} else {
			localStorage.removeItem('REACT_TOKEN_AUTH');
		}
		_token = token;
		notify();
	};

	return {
		getToken,
		isLoggedIn,
		setToken,
		subscribe,
		unsubscribe,
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

	const authFetch = async (input, init) => {
		const token = await tokenProvider.getToken();

		init = init || {};

		init.headers = {
			...init.headers,
			Authorization: `Bearer ${token}`,
		};

		return fetch(input, init);
	};

	const useAuth = () => {
		const [isLogged, setIsLogged] = useState(tokenProvider.isLoggedIn());

		useEffect(() => {
			const listener = (newIsLogged) => {
				setIsLogged(newIsLogged);
			};

			tokenProvider.subscribe(listener);

			return () => {
				tokenProvider.unsubscribe(listener);
			};
		}, []);

		return [isLogged];
	};

	return {
		useAuth,
		authFetch,
		login,
		logout,
	};
};