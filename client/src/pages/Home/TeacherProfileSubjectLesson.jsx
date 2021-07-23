import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectLessonById,
	teacherLessonDelete,
} from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';

const TeacherProfileSubjectLesson = React.memo(
	({ index, courseID, lessonID, isPublished }) => {
		const lesson = useSelector((state) => selectLessonById(state, lessonID));

		const dispatch = useDispatch();
		const { request } = useAuthFetch();

		const deleteLessonHandler = () => {
			request(
				'/api/school/dellesson/',
				'DELETE',
				{
					courseID,
					lessonID,
				},
				{},
				() => {
					dispatch(teacherLessonDelete({ courseID, lessonID }));
				}
			);
		};

		return (
			<div className='subject__lesson'>
				{isPublished ? (
					''
				) : (
					<div
						className='subject__lesson-del'
						title='Удалить урок'
						onClick={deleteLessonHandler}>
						&#215;
					</div>
				)}
				<div className='subject__lesson-number'>Занятие: {index + 1}</div>
				<div className='subject__lesson-type'>Тип: {lesson.location}</div>
				<div className='subject__lesson-time'>Начало: {lesson.date}</div>
				<div className='subject__lesson-time'>Конец: {lesson.endDate}</div>
			</div>
		);
	}
);

TeacherProfileSubjectLesson.propTypes = {
	index: PropTypes.number,
	courseID: PropTypes.string,
	lessonID: PropTypes.string,
	isPublished: PropTypes.bool,
};

export default TeacherProfileSubjectLesson;
