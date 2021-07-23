import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { teacherUsersdataDelete } from '../../redux/reducers/userInfoSlice';
import TeacherProfileSubjectForm from './TeacherProfileSubjectForm';
import TeacherProfileSubjectLesson from './TeacherProfileSubjectLesson';
import TeacherProfileLessonsForm from './TeacherProfileLessonsForm';
import TeacherProfileSubjectUser from './TeacherProfileSubjectUser';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import { ChevronDown } from '../../assets/icons';

const TeacherProfileSubject = React.memo(({ course }) => {
	const [isClose, setisClose] = React.useState(true);
	const [height, setHeight] = React.useState('0px');

	const content = React.useRef(null);

	const { request } = useAuthFetch();
	const dispatch = useDispatch();

	const btnHandler = () => {
		setisClose(!isClose);
		setHeight(isClose ? `${content.current.scrollHeight}px` : '0px');
	};

	const refundAllUsersBtnHandler = () => {
		request(
			'/api/school/refund',
			'POST',
			{
				courseID: course._id,
			},
			{},
			() => {
				dispatch(
					teacherUsersdataDelete({
						courseID: course._id,
						userdatasID: course.usersdataIds,
					})
				);
			}
		);
	};

	return (
		<div className='teacher-profile__subject'>
			<div className='subject'>
				<div className='subject__container'>
					<div className='subject__row '>
						<div className='subject__title'>{course.title}</div>
						<div className='subject__container'>
							<span className='mr-10'>{course.price} грн</span>
							<button
								className={
									'btn btn--transparent ' + (isClose ? '' : 'btn--rotate')
								}
								onClick={btnHandler}>
								<ChevronDown />
							</button>
						</div>
					</div>
					<div
						ref={content}
						style={{ maxHeight: height }}
						className={
							'subject__info ' + (isClose ? '' : 'subject__info--active')
						}>
						<TeacherProfileSubjectForm course={course} />

						<span className='subject__min-title'>Уроки</span>
						<div className='subject__lessons'>
							{course.lessonsIds.length ? (
								course.lessonsIds.map((lessonID, index) => (
									<TeacherProfileSubjectLesson
										key={lessonID}
										index={index}
										courseID={course._id}
										lessonID={lessonID}
										isPublished={course.isPublished}
									/>
								))
							) : (
								<div>Уроков нет</div>
							)}
							{!course.isPublished && (
								<TeacherProfileLessonsForm courseID={course._id} />
							)}
						</div>
					</div>
				</div>
			</div>
			<div className='subject__users'>
				{course.usersdataIds.length ? (
					<>
						{course.usersdataIds.map((userID) => (
							<TeacherProfileSubjectUser
								key={userID}
								courseID={course._id}
								userID={userID}
							/>
						))}
						<button className='btn' onClick={refundAllUsersBtnHandler}>
							Вернуть деньги всем ученикам
						</button>
					</>
				) : (
					<div className='subject__user-info'>Учеников нет</div>
				)}
			</div>
		</div>
	);
});

TeacherProfileSubject.propTypes = {
	course: PropTypes.object,
};

export default TeacherProfileSubject;
