import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { removeNote } from '../../redux/reducers/notificationSlice';

const Notification = ({ data }) => {
	const dispatch = useDispatch();

	const [exit, setExit] = React.useState(false);
	const [width, setWidth] = React.useState(0);
	const [intervalId, setIntervalId] = React.useState(null);

	const handleStartTimer = () => {
		const id = setInterval(() => {
			setWidth((prev) => {
				if (prev < 100) {
					return prev + 0.5;
				}

				clearInterval(id);
				return prev;
			});
		}, 20);

		setIntervalId(id);
	};

	const handlePauseTimer = () => {
		clearInterval(intervalId);
	};

	const handleCloseNotification = () => {
		handlePauseTimer();
		setExit(true);
		setTimeout(() => {
			dispatch(removeNote(data.id));
		}, 400);
	};

	React.useEffect(() => {
		if (width === 100) {
			handleCloseNotification();
		}
	}, [width]);

	React.useEffect(() => {
		handleStartTimer();
	}, []);

	return (
		<div
			onMouseEnter={handlePauseTimer}
			onMouseLeave={handleStartTimer}
			className={`notification ${
				data.type === 'SUCCESS'
					? 'success'
					: data.type === 'LOADING'
					? 'loading'
					: 'error'
			} ${exit ? 'exit' : ''}`}>
			<p>{data.message}</p>
			<div className='notification__bar' style={{ width: `${width}%` }}></div>
		</div>
	);
};

Notification.propTypes = {
	data: PropTypes.object,
};

export default Notification;
