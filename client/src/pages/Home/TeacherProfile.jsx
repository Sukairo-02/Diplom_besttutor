import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getBoughtCourses } from '../../redux/selectors';
import {
	fetchTeacherCourses,
	fetchBoughtCourses,
	selectAllTeacherCourses,
} from '../../redux/reducers/userInfoSlice';
import TeacherProfileForm from './TeacherProfileForm';
import TeacherProfileSubject from './TeacherProfileSubject';
import { BoughtSubject, Loader } from '../../Components';

const TeacherProfile = ({
	teacherId,
	teacherSubject,
	teacherCoursesIsTrue,
	coursesIsTrue,
}) => {
	const teacherCourses = useSelector(selectAllTeacherCourses);
	const courses = useSelector(getBoughtCourses);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (coursesIsTrue && !courses.length) {
			dispatch(fetchBoughtCourses());
		}
	}, [dispatch, coursesIsTrue, courses.length]);

	React.useEffect(() => {
		if (teacherCoursesIsTrue && !teacherCourses.length) {
			dispatch(fetchTeacherCourses());
		}
	}, [teacherCoursesIsTrue, teacherCourses.length, dispatch]);

	return (
		<div className='content'>
			<div className='content__main'>
				<div className='teacher-profile'>
					<h2 className='teacher-profile__title'>Созданные курсы</h2>
					<div className='teacher-profile__subjects'>
						{teacherCourses.length ? (
							teacherCourses.map((course) => (
								<TeacherProfileSubject key={course._id} course={course} />
							))
						) : teacherCoursesIsTrue && !teacherCourses.lenght ? (
							<Loader text='Загрузка созданных курсов' />
						) : (
							<div>Созданных курсов нет</div>
						)}
					</div>
					<h2 className='teacher-profile__title'>Купленные курсы</h2>
					<div className='teacher-profile__subjects'>
						{courses.length ? (
							courses.map((course) => (
								<BoughtSubject key={course._id} course={course} />
							))
						) : coursesIsTrue && !courses.length ? (
							<Loader text='Загрузка купленных курсов' />
						) : (
							<div>Купленных курсов нет</div>
						)}
					</div>
				</div>
			</div>
			<div className='content__aside'>
				<TeacherProfileForm
					teacherId={teacherId}
					teacherSubject={teacherSubject}
				/>
			</div>
		</div>
	);
};

TeacherProfile.propTypes = {
	teacherId: PropTypes.string,
	teacherSubject: PropTypes.string,
	teacherCourses: PropTypes.array,
	courses: PropTypes.array,
};

export default TeacherProfile;
