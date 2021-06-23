import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { BoughtSubject } from '../../Components';

const UserProfile = ({ courses }) => {
	const history = useHistory();

	const btnHandler = () => {
		history.push('/teachers');
	};

	return (
		<>
			{!courses.length ? (
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
					<h2 className='user-profile__title'>Купленные курсы</h2>
					<div className='user-profile__subjects'>
						{courses.map((course) => (
							<BoughtSubject key={course._id} course={course} />
						))}
					</div>
				</div>
			)}
		</>
	);
};

UserProfile.propTypes = {
	courses: PropTypes.array,
};

export default UserProfile;
