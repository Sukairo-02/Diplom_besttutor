import React from 'react';
import PropTypes from 'prop-types';
import TeacherProfileForm from './TeacherProfileForm';
import TeacherProfileSubject from './TeacherProfileSubject';
import { BoughtSubject } from '../../Components';

const TeacherProfile = ({ teacherCourses, courses }) => {
	return (
		<div className='content'>
			<div className='content__main'>
				<div className='teacher-profile'>
					<h2 className='teacher-profile__title'>Созданные курсы</h2>
					<div className='teacher-profile__subjects'>
						{teacherCourses.length
							? teacherCourses.map((course) => (
									<TeacherProfileSubject key={course._id} course={course} />
							  ))
							: ''}
					</div>
					<h2 className='teacher-profile__title'>Купленные курсы</h2>
					<div className='teacher-profile__subjects'>
						{courses.length
							? courses.map((course) => (
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

TeacherProfile.propTypes = {
	teacherCourses: PropTypes.array,
	courses: PropTypes.array,
};

export default TeacherProfile;
