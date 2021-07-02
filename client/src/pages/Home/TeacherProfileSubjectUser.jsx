import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectUserById,
	teacherUserdataDelete,
} from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';

const TeacherProfileSubjectUser = React.memo(({ courseID, userID }) => {
	const user = useSelector((state) => selectUserById(state, userID));
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const refundOneUserBtnHandler = () => {
		request(
			`/api/school/refund/${userID}`,
			'POST',
			{
				courseID: courseID,
			},
			{},
			() => {
				dispatch(teacherUserdataDelete({ courseID, userdataID: userID }));
			}
		);
	};

	return (
		<div className='subject__user'>
			<img src={user.avatar} alt='Аватар' className='subject__user-avatar' />
			<div className='subject__container'>
				<div className='subject__user-name'>{user.username}</div>
				<div className='subject__user-email'>{user.email}</div>
			</div>
			<button
				className='btn btn--transparent'
				onClick={refundOneUserBtnHandler}>
				Вернуть деньги ученику
			</button>
		</div>
	);
});

TeacherProfileSubjectUser.propTypes = {
	courseID: PropTypes.string,
	userID: PropTypes.string,
};

export default TeacherProfileSubjectUser;
