import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBoughtCourses } from '../../redux/selectors';
import { fetchBoughtCourses } from '../../redux/reducers/userInfoSlice';
import { BoughtSubject, Loader } from '../../Components';

const UserProfile = ({ coursesIsTrue }) => {
	const courses = useSelector(getBoughtCourses);
	const dispatch = useDispatch();
	const history = useHistory();

	React.useEffect(() => {
		if (coursesIsTrue && !courses.length) {
			dispatch(fetchBoughtCourses());
		}
	});

	const btnHandler = () => {
		history.push('/teachers');
	};

	return (
		<>
			{coursesIsTrue ? (
				<div className='user-profile'>
					<h2 className='user-profile__title'>Купленные курсы</h2>
					<div className='user-profile__subjects'>
						{courses.length ? (
							courses.map((course) => (
								<BoughtSubject key={course._id} course={course} />
							))
						) : (
							<Loader text='Загрузка купленных курсов' />
						)}
					</div>
				</div>
			) : (
				<div className='content__empty'>
					У вас пока нет предмета и учителя.
					<br />
					<br />
					<button className='btn' type='button' onClick={btnHandler}>
						Начать поиск
					</button>
				</div>
			)}
		</>
	);
};

UserProfile.propTypes = {
	courses: PropTypes.array,
};

export default UserProfile;
