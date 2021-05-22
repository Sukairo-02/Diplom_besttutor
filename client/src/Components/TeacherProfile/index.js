import React from 'react';
import { useSelector } from 'react-redux';
import TeacherProfileForm from './TeacherProfileForm';
import TeacherProfileSubject from './TeacherProfileSubject';
import TeacherProfileSimpleSubjects from './TeacherProfileSimpleSubjects';

const TeacherProfile = () => {
	const { info } = useSelector(({ userInfo }) => userInfo);

	return (
		<div className='content'>
			<div className='content__main'>
				<div className='teacher-profile'>
					<h2>Созданные курсы</h2>
					<div className='teacher-profile__subjects'>
						{info.teacherCourses.length
							? info.teacherCourses.map((course) => (
									<TeacherProfileSubject key={course._id} course={course} />
							  ))
							: ''}
					</div>
					<h2>Купленные курсы</h2>
					<div className='teacher-profile__subjects'>
						{info.courses.length
							? info.courses.map((course) => (
									<TeacherProfileSimpleSubjects
										key={course._id}
										course={course}
									/>
							  ))
							: ''}
					</div>
				</div>
			</div>
			<div className='content__aside'>
				<TeacherProfileForm />
			</div>
		</div>
	);
};

export default TeacherProfile;
