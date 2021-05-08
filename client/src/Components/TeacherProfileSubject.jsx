import React from 'react';
import { ChevronDown } from '../assets/icons';

const TeacherProfileSubject = ({ course }) => {
	const [isclose, setIsClose] = React.useState(true);
	const [height, setHeight] = React.useState('0px');

	const content = React.useRef(null);

	const btnHandler = () => {
		setIsClose(!isclose);
		setHeight(isclose ? `${content.current.scrollHeight}px` : '0px');
	};

	console.log(course);

	return (
		<div className='teacher-profile__subject'>
			<div className='subject'>
				<div className='subject__container'>
					<div
						className={'subject__row ' + (isclose ? '' : 'subject__row--mb')}>
						<div className='subject__title'>{course.title}</div>
						<div className='subject__container'>
							<button className='btn mr-10'>{course.price} грн</button>
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
						className='subject__info'>
						<form className='subject__form'>
							<fieldset className='form__fieldset form__fieldset--flex'>
								<fieldset className='form__fieldset'>
									<label className='form__label'>
										Опубликован: {course.isPublished ? '✅' : '❌'}
									</label>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label'>
										Заблокирован: {course.isBlocked ? '✅' : '❌'}
									</label>
								</fieldset>
							</fieldset>
							<fieldset className='form__fieldset form__fieldset--flex'>
								<fieldset className='form__fieldset'>
									<label htmlFor='subject' className='form__label'>
										Предмет
									</label>
									<input
										className='form__input'
										type='text'
										name='subject'
										defaultValue={course.subject}
									/>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label htmlFor='name' className='form__label'>
										Название курса
									</label>
									<input
										className='form__input'
										type='text'
										name='name'
										defaultValue={course.title}
									/>
								</fieldset>
							</fieldset>
							<fieldset className='form__fieldset'>
								<label htmlFor='price' className='form__label'>
									Цена (грн)
								</label>
								<input
									className='form__input'
									type='text'
									name='price'
									defaultValue={course.price}
								/>
							</fieldset>
							<fieldset className='form__fieldset'>
								<label htmlFor='desc' className='form__label'>
									Описание курса
								</label>
								<textarea
									className='form__desc'
									name='desc'
									defaultValue={course.desc}></textarea>
							</fieldset>
						</form>
						<span className='subject__min-title'>Уроки</span>
						<div className='subject__lessons'>
							{course.lessons &&
								course.lessons.map((lesson, index) => (
									<div className='subject__lesson' key={lesson._id}>
										<div className='subject__lesson-number'>
											Занятие: {index + 1}
										</div>
										<div className='subject__lesson-type'>
											Тип занятия: {lesson.location}
										</div>
										<div className='subject__lesson-start'>
											Начало заняти: {lesson.date.slice(0, 10)}
										</div>
										<div className='subject__lesson-end'>
											Конец заняти: {lesson.endDate.slice(0, 10)}
										</div>
									</div>
								))}
						</div>
						<div className='subject__container'>
							<button className='btn mr-10'>Опубликовать</button>
							<button className='btn mr-10'>Обновить</button>
							<button className='btn btn--red'>Заблокировать</button>
						</div>
					</div>
				</div>
			</div>
			<div className='subject__users'>
				{course.usersdata &&
					course.usersdata.map((user) => (
						<div className='subject__user' key={user.id}>
							<img
								src={user.avatar}
								alt='Аватар'
								className='subject__user-avatar'
							/>
							<div className='subject__container'>
								<div className='subject__user-name'>{user.username}</div>
								<div className='subject__user-email'>{user.email}</div>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default TeacherProfileSubject;
