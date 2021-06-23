import React from 'react';
import { useSelector } from 'react-redux';
import { getNotifications } from '../../redux/selectors';
import Notification from './Notification';

const Notifications = () => {
	const notes = useSelector(getNotifications);

	return (
		<div className='notifications'>
			{notes.map((note) => (
				<Notification key={note.id} data={note} />
			))}
		</div>
	);
};

export default Notifications;
