import React from 'react';
import { v4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { createAuthProvider } from '../jwt';
import { addNote } from '../redux/reducers/notificationSlice';

export const useAuthFetch = () => {
	const dispatch = useDispatch();
	const { authFetch } = createAuthProvider();

	const request = React.useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			dispatch(
				addNote({
					id: v4(),
					type: 'LOADING',
					message: 'Загрузка',
				})
			);

			try {
				const result = await authFetch(url, method, body, headers);

				dispatch(
					addNote({
						id: v4(),
						type: 'SUCCESS',
						message: result.message || 'Загружено',
					})
				);

				return result;
			} catch (err) {
				dispatch(
					addNote({
						id: v4(),
						type: 'Error',
						message: err.message || 'Что-то пошло не так',
					})
				);

				return err;
			}
		},
		[authFetch, dispatch]
	);

	return { request };
};
