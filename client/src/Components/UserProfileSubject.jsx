import React from 'react';
import { ChevronDown } from '../assets/icons';

const UserProfileSubject = ({ course }) => {
	const [isclose, setIsClose] = React.useState(true);
	const [height, setHeight] = React.useState('0px');

	const content = React.useRef(null);

	const btnHandler = () => {
		setIsClose(!isclose);
		setHeight(isclose ? `${content.current.scrollHeight}px` : '0px');
	};

	return (
		<div className='user-profile__subject'>
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
						<div className='subject__desc'>{course.desc}</div>
						<span className='subject__min-title'>Уроки</span>
						<div className='subject__lessons'>
							{course.lessons.length &&
								course.lessons.map((lesson, index) => (
									<div className='subject__lesson' key={lesson._id}>
										<div className='subject__lesson-number'>
											Занятие: {index + 1}
										</div>
										<div className='subject__lesson-type'>
											Тип: {lesson.location}
										</div>
										<div className='subject__lesson-start'>
											Начало: {lesson.date.slice(0, 10)}
										</div>
										<div className='subject__lesson-end'>
											Конец: {lesson.endDate.slice(0, 10)}
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfileSubject;
