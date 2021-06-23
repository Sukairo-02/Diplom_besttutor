import React from 'react';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/selectors';
import UserProfile from './UserProfile';
import TeacherProfile from './TeacherProfile';
import { Loader } from '../../Components';

export const Home = () => {
	const info = useSelector(getUserInfo);

	return (
		<main className='main'>
			<div className='container'>
				{Object.keys(info).length !== 0 ? (
					<>
						{info.roles[0] === 'TCHR' ? (
							<TeacherProfile
								teacherCourses={info.teacherCourses}
								courses={info.courses}
							/>
						) : (
							<UserProfile courses={info.courses} />
						)}
					</>
				) : (
					<Loader text={'Загрузка профиля'} />
				)}
			</div>
		</main>
	);
};