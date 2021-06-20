import React from 'react';

export const useFetch = () => {
	const [loading, setLoading] = React.useState(false);

	const request = React.useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			setLoading(true);

			try {
				if (body) {
					body = JSON.stringify(body);
					headers['Content-Type'] = 'application/json';
				}

				const response = await fetch(url, { method, body, headers });
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || 'Что-то пошло не так');
				}

				setLoading(false);

				return data;
			} catch (err) {
				setLoading(false);
				alert(err.message);

				return err;
			}
		},
		[]
	);

	return { loading, request };
};
