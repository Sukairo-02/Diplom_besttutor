import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { fetchTaskForStudent } from '../redux/reducers/taskSlice';
import { useAuthFetch } from '../hooks/authFetch.hook';
import { FormInput, FormTextarea } from './index';
import * as yup from 'yup';
import { ChevronDown } from '../assets/icons';

const validationSchema = yup.object({
	teacher: yup.string(),
	rating: yup
		.number('Рейтинг должен быть указана в цифрах')
		.positive('Рейтинг должен быть больше 0')
		.max(10, 'Максимум 10')
		.required('Рейтинг обязателен'),
	text: yup.string().required('Текс отзыва обязателен'),
});

const BoughtSubject = React.memo(({ course }) => {
	const [isclose, setIsClose] = React.useState(true);
	const [height, setHeight] = React.useState('0px');

	const content = React.useRef(null);

	const { request } = useAuthFetch();
	const dispatch = useDispatch();

	const history = useHistory();

	const taskBtnHandeler = async (id) => {
		await dispatch(fetchTaskForStudent(id));
		history.push('/task');
	};

	const chevronHandler = () => {
		setIsClose(!isclose);
		setHeight(isclose ? `${content.current.scrollHeight}px` : '0px');
	};

	const formSubmitHandler = (formData) => {
		request('/api/school/review', 'POST', formData);
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
								onClick={chevronHandler}>
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
										<div className='subject__lesson-time'>
											Начало: {lesson.date}
										</div>
										<div className='subject__lesson-time'>
											Конец: {lesson.endDate}
										</div>
									</div>
								))}
						</div>
						<span className='subject__min-title'>Задания</span>
						<div className='subject__tasks' style={{ marginTop: 0 }}>
							{course.assignments.length ? (
								course.assignments.map((assignment) => (
									<div className='subject__task' key={assignment._id}>
										<div className='subject__task-name'>{assignment.title}</div>
										<button
											className='btn'
											type='button'
											title='Пройти задание'
											onClick={() => taskBtnHandeler(assignment._id)}>
											Открыть
										</button>
									</div>
								))
							) : (
								<span>Заданий нет</span>
							)}
						</div>
						<span className='subject__min-title'>Отзыв</span>
						<Formik
							initialValues={{
								teacher: course.teacher,
								rating: '',
								text: '',
							}}
							validationSchema={validationSchema}
							onSubmit={(values) => {
								formSubmitHandler(values);
							}}>
							<Form className='form teacher-profile__form'>
								<h3 className='form__title'>Добавить/изменить отзыв</h3>
								<fieldset className='form__fieldset'>
									<FormInput label='Рейтинг' name='rating' type='number' />
								</fieldset>
								<fieldset className='form__fieldset'>
									<FormTextarea label='Отзыв' name='text' />
								</fieldset>
								<button className='btn' type='submit'>
									Добавить
								</button>
							</Form>
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
});

BoughtSubject.propTypes = {
	course: PropTypes.object,
};

export default BoughtSubject;
