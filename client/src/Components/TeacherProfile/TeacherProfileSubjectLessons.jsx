import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { createAuthProvider } from '../../jwt';
import TeacherProfileLessonsForm from './TeacherProfileLessonsForm';

const TeacherProfileSubjectLessons = ({ course }) => {
	const dispatch = useDispatch();
	const { authFetch } = createAuthProvider();

	const deleteLessonBtnHandler = async (id) => {
		try {
			const result = await authFetch('/api/school/dellesson/', 'DELETE', {
				courseID: course._id,
				lessonID: id,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div className='subject__lessons'>
			{course.lessons.length ? (
				course.lessons.map((lesson, index) => (
					<div className='subject__lesson' key={lesson._id}>
						{course.isPublished ? (
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
			{!course.isPublished && <TeacherProfileLessonsForm id={course._id} />}
		</div>
	);
};

export default TeacherProfileSubjectLessons;
