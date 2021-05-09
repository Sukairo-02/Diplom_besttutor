import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UserProfileSubject } from './index';

const UserProfile = () => {
	const history = useHistory();
	const info = useSelector((state) => state.userInfo.info);

	const btnHandler = React.useCallback(() => {
		history.push('/teachers');
	}, [history]);

	return (
		<>
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
				<div className='user-profile'>
					<div className='user-profile__subjects'>
						{info.courses.map((course) => (
							<UserProfileSubject key={course._id} course={course} />
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default UserProfile;
