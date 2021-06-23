import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import TeacherProfileLessonsForm from './TeacherProfileLessonsForm';

const TeacherProfileSubjectLessons = ({ courseId, lessons, isPublished }) => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const deleteLessonBtnHandler = (lessonId) => {
		request('/api/school/dellesson/', 'DELETE', {
			courseID: courseId,
			lessonID: lessonId,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	return (
		<div className='subject__lessons'>
			{lessons.length ? (
				lessons.map((lesson, index) => (
					<div className='subject__lesson' key={lesson._id}>
						{isPublished ? (
							''
						) : (
							<div
								className='subject__lesson-del'
								title='Удалить урок'
								onClick={() => deleteLessonBtnHandler(lesson._id)}>
								&#215;
							</div>
						)}
						<div className='subject__lesson-number'>Занятие: {index + 1}</div>
						<div className='subject__lesson-type'>Тип: {lesson.location}</div>
						<div className='subject__lesson-time'>Начало: {lesson.date}</div>
						<div className='subject__lesson-time'>Конец: {lesson.endDate}</div>
					</div>
				))
			) : (
				<div>Уроков нет</div>
			)}
			{!isPublished && <TeacherProfileLessonsForm id={courseId} />}
		</div>
	);
};

TeacherProfileSubjectLessons.propTypes = {
	courseId: PropTypes.string,
	lessons: PropTypes.array,
	isPublished: PropTypes.bool,
};

export default TeacherProfileSubjectLessons;
