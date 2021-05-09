import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherCourses } from '../redux/reducers/userInfoSlice';
import { TeacherProfileSubject, TeacherProfileForm } from './index';

const TeacherProfile = () => {
	const dispatch = useDispatch();
	const { info } = useSelector(({ userInfo }) => userInfo);

	React.useEffect(() => {
		dispatch(fetchTeacherCourses());
	}, [dispatch]);

	return (
		<div className='content'>
			{!info.teacherCourses.length ? (
				<div className='content__empty'>
					У вас пока нет предметов и учеников.
					<button className='btn' type='button'>
						Настроить профиль
					</button>
				</div>
			) : (
				<>
					<div className='content__main'>
						<div className='teacher-profile'>
							<div className='teacher-profile__subjects'>
								{typeof info.teacherCourses[0] === 'object' &&
									info.teacherCourses.map((course) => (
										<TeacherProfileSubject key={course._id} course={course} />
									))}
							</div>
						</div>
					</div>
					<div className='content__aside'>
						<TeacherProfileForm />
					</div>
				</>
			)}
		</div>
	);
};

export default TeacherProfile;
