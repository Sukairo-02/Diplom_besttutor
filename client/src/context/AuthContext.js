import React from 'react';

function noop() {}

export const AuthContext = React.createContext({
	login: noop,
	logout: noop,
	token: null,
	refreshToken: null,
	userId: null,
	loader: false,
	isAuthenticated: false,
});
