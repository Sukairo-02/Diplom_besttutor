import React from 'react';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/selectors';
import UserProfile from './UserProfile';
import TeacherProfile from './TeacherProfile';

export const Home = () => {
	const info = useSelector(getUserInfo);

	return (
		<main className='main'>
			<div className='container'>
				{info.roles[0] === 'TCHR' ? (
					<TeacherProfile
						teacherId={info._id}
						teacherSubject={info.subject}
						teacherCoursesIsTrue={!!info.teacherCourses.length}
						coursesIsTrue={!!info.courses.length}
					/>
				) : (
					<UserProfile coursesIsTrue={!!info.courses.length} />
				)}
			</div>
		</main>
	);
};
