import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../redux/reducers/userInfoSlice';
import { Formik, Form } from 'formik';
import { FormInput, FormTextarea, TeacherProfileLessonsForm } from './index';
import * as yup from 'yup';
import { createAuthProvider } from '../jwt';
import { ChevronDown } from '../assets/icons';

const validationSchema = yup.object({
	title: yup.string().required('Название курса обязательно'),
	price: yup.string().required('Цена (грн) обязательно'),
	desc: yup.string().required('Описание курса обязательно'),
});

const TeacherProfileSubject = ({ course }) => {
	const dispatch = useDispatch();
	const { authFetch } = createAuthProvider();
	const [isclose, setIsClose] = React.useState(true);
	const [height, setHeight] = React.useState('0px');

	const content = React.useRef(null);

	const btnHandler = () => {
		setIsClose(!isclose);
		setHeight(isclose ? `${content.current.scrollHeight}px` : '0px');
	};

	const publishBtnHandler = async () => {
		const body = JSON.stringify({
			courseID: course._id,
		});

		try {
			let response = await authFetch('/api/school/publishcourse/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});
			let result = await response.json();
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const updateBtnHandler = async (data) => {
		try {
			let response = await authFetch('/api/school/editcourse/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			let result = await response.json();
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const updatePriceBtnHandler = async (data) => {
		const body = JSON.stringify({
			courseID: course._id,
			price: data,
		});

		try {
			let response = await authFetch('/api/school/editprice/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});
			let result = await response.json();
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const unblockeBtnHandler = async () => {
		const body = JSON.stringify({
			courseID: course._id,
		});

		try {
			let response = await authFetch('/api/school/unblockcourse/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});
			let result = await response.json();
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const blockeBtnHandler = async () => {
		const body = JSON.stringify({
			courseID: course._id,
		});

		try {
			let response = await authFetch('/api/school/blockcourse/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});
			let result = await response.json();
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const deleteBtnHandler = async () => {
		const body = JSON.stringify({
			courseID: course._id,
		});

		try {
			let response = await authFetch('/api/school/deletecourse/', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});
			let result = await response.json();
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div className='teacher-profile__subject'>
			<div className='subject'>
				<div className='subject__container'>
					<div className='subject__row '>
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
						className={
							'subject__info ' + (isclose ? '' : 'subject__info--active')
						}>
						<Formik
							initialValues={{
								courseID: course._id,
								subject: course.subject,
								title: course.title,
								price: course.price,
								desc: course.desc,
							}}
							validationSchema={validationSchema}>
							{(formik) => (
								<Form className='form subject__form'>
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
											<FormInput
												label='Предмет'
												name='subject'
												type='text'
												disabled
											/>
										</fieldset>
										<fieldset className='form__fieldset'>
											<FormInput
												label='Название курса'
												name='title'
												type='text'
											/>
										</fieldset>
									</fieldset>
									<fieldset className='form__fieldset'>
										<FormInput label='Цена (грн)' name='price' type='number' />
									</fieldset>
									<fieldset className='form__fieldset'>
										<FormTextarea label='Описание курса' name='desc' />
									</fieldset>
									<div className='subject__btns'>
										<button
											type='button'
											className='btn'
											onClick={publishBtnHandler}>
											Опубликовать
										</button>
										<button
											type='button'
											className='btn'
											onClick={() => updateBtnHandler(formik.values)}>
											Обновить
										</button>
										<button
											type='button'
											className='btn'
											onClick={() =>
												updatePriceBtnHandler(formik.values.price)
											}>
											Обновить цену
										</button>
										<button
											type='button'
											className='btn'
											onClick={unblockeBtnHandler}>
											Разблокировать
										</button>
										<button
											type='button'
											className='btn btn--red'
											onClick={blockeBtnHandler}>
											Заблокировать
										</button>
										<button
											type='button'
											className='btn btn--red'
											onClick={deleteBtnHandler}>
											Удалить
										</button>
									</div>
								</Form>
							)}
						</Formik>
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
							{!course.isPublished && (
								<TeacherProfileLessonsForm id={course._id} />
							)}
						</div>
					</div>
				</div>
			</div>
			<div className='subject__users'>
				{course.usersdata.length ? (
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
					))
				) : (
					<div className='subject__user-info'>Учеников нет</div>
				)}
			</div>
		</div>
	);
};

export default TeacherProfileSubject;
