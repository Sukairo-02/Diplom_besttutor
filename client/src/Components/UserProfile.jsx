import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const UserProfile = () => {
	const history = useHistory();
	const info = useSelector((state) => state.userInfo.info);

	const btnHandler = React.useCallback(() => {
		history.push('/subjects');
	}, [history]);

	return (
		<div>
			{!info.courses.length ? (
				<div className='content__empty'>
					У вас пока нет предмета и учителя.
					<br />
					<br />
					<button className='btn' type='button' onClick={btnHandler}>
						Начать поиск
					</button>
				</div>
			) : (
				<div>Courses</div>
			)}
		</div>
	);
};

export default UserProfile;
