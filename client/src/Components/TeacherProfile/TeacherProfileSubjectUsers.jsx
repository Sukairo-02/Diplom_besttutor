import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';

const TeacherProfileSubjectUsers = ({ courseId, usersdata }) => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const refundOneUserBtnHandler = (id) => {
		request(`/api/school/refund/${id}`, 'POST', {
			courseID: courseId,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	const refundAllUsersBtnHandler = () => {
		request('/api/school/refund', 'POST', {
			courseID: courseId,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	return (
		<>
			{usersdata.length ? (
				<>
					{usersdata.map((user) => (
						<div className='subject__user' key={user.id}>
							<img
								src={user.avatar}
								alt='Аватар'
								className='subject__user-avatar'
							/>
							<div className='subject__container'>
								<div className='subject__user-name'>{user.username}</div>
								<div className='subject__user-email'>{user.email}</div>
							</div>
							<button
								className='btn btn--transparent'
								onClick={() => refundOneUserBtnHandler(user.id)}>
								Вернуть деньги ученику
							</button>
						</div>
					))}
					<button className='btn' onClick={refundAllUsersBtnHandler}>
						Вернуть деньги всем ученикам
					</button>
				</>
			) : (
				<div className='subject__user-info'>Учеников нет</div>
			)}
		</>
	);
};

TeacherProfileSubjectUsers.propTypes = {
	courseId: PropTypes.string,
	usersdata: PropTypes.array,
};

export default TeacherProfileSubjectUsers;
