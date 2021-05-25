import React from 'react';
import TeacherProfileForm from './TeacherProfileForm';
import TeacherProfileSubject from './TeacherProfileSubject';
import { BoughtSubject } from '../index';

const TeacherProfile = ({ info }) => {
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
									<BoughtSubject key={course._id} course={course} />
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
