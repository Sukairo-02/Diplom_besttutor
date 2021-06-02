import React from 'react';
import { createAuthProvider } from '../../jwt';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';

const TeacherProfileSubjectUsers = ({ course }) => {
	const dispatch = useDispatch();
	const { authFetch } = createAuthProvider();

	const refundOneUserBtnHandler = async (id) => {
		try {
			const result = await authFetch(`/api/school/refund/${id}`, 'POST', {
				courseID: course._id,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const refundAllUsersBtnHandler = async () => {
		try {
			const result = await authFetch(`/api/school/refund`, 'POST', {
				courseID: course._id,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<>
			{course.usersdata.length ? (
				<>
					{course.usersdata.map((user) => (
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

export default TeacherProfileSubjectUsers;
