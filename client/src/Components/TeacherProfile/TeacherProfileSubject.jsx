import React from 'react';
import TeacherProfileSubjectLessons from './TeacherProfileSubjectLessons';
import TeacherProfileSubjectForm from './TeacherProfileSubjectForm';
import TeacherProfileSubjectUsers from './TeacherProfileSubjectUsers';
import { ChevronDown } from '../../assets/icons';

const TeacherProfileSubject = ({ course }) => {
	const [isclose, setIsClose] = React.useState(true);
	const [height, setHeight] = React.useState('0px');

	const content = React.useRef(null);

	const btnHandler = () => {
		setIsClose(!isclose);
		setHeight(isclose ? `${content.current.scrollHeight}px` : '0px');
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
									'btn btn--transparent ' + (isclose ? '' : 'btn--rotate')
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
							'subject__info ' + (isclose ? '' : 'subject__info--active')
						}>
						<TeacherProfileSubjectForm course={course} />
						<span className='subject__min-title'>Уроки</span>
						<TeacherProfileSubjectLessons course={course} />
					</div>
				</div>
			</div>
			<div className='subject__users'>
				<TeacherProfileSubjectUsers course={course} />
			</div>
		</div>
	);
};

export default TeacherProfileSubject;
