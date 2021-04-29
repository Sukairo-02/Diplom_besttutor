import React from 'react';

function noop() {}

export const AuthContext = React.createContext({
	login: noop,
	logout: noop,
	token: null,
	userId: null,
	isAuthenticated: false,
});
