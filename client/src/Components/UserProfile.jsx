import React from 'react';
import { useHistory } from 'react-router-dom';
import { BoughtSubject } from './index';

const UserProfile = ({ info }) => {
	const history = useHistory();

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
					<h2>Купленные курсы</h2>
					<div className='user-profile__subjects'>
						{info.courses.map((course) => (
							<BoughtSubject key={course._id} course={course} />
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default UserProfile;
