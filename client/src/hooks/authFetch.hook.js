import React from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { createAuthProvider } from '../jwt';
import { addNote } from '../redux/reducers/notificationSlice';

export const useAuthFetch = () => {
	const dispatch = useDispatch();
	const { authFetch } = createAuthProvider();

	const request = React.useCallback(
		async (url, method = 'GET', body = null, headers = {}, cb) => {
			dispatch(
				addNote({
					id: nanoid(),
					type: 'LOADING',
					message: 'Загрузка',
				})
			);

			try {
				const result = await authFetch(url, method, body, headers);

				dispatch(
					addNote({
						id: nanoid(),
						type: 'SUCCESS',
						message: result.message || 'Загружено',
					})
				);

				if (cb) cb(result);

				return result;
			} catch (err) {
				dispatch(
					addNote({
						id: nanoid(),
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
