import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherCourses } from '../redux/reducers/userInfoSlice';
import {
	fetchTaskForTeacher,
	fetchStatisticForTeacher,
} from '../redux/reducers/taskSlice';
import { getUserInfo } from '../redux/selectors';
import { Formik, Form, FieldArray } from 'formik';
import { createAuthProvider } from '../jwt';
import { useHistory } from 'react-router-dom';
import {
	FormInput,
	FormTextarea,
	FormCheckbox,
	FormSelect,
	TasksQuestions,
	Loader,
} from '../Components';
import * as yup from 'yup';

const validationSchema = yup.object({
	courseID: yup.string().required('Выберите курс'),
	title: yup.string().required('Название курса обязательно'),
	desc: yup.string().required('Описание курса обязательно'),
	isShuffled: yup.boolean(),
	allowOvertime: yup.boolean(),
	date: yup.date().required('Выберите начало урока'),
	endDate: yup.date().required('Выберите конец урока'),
	questions: yup
		.array(
			yup.object({
				title: yup.string().required('Название вопроса обязательно'),
				points: yup.number().required('Выберите количесво баллов'),
				isMulAnswers: yup.boolean(),
				answers: yup
					.array(
						yup.object({
							text: yup.string().required('Название ответа обязательно'),
							isTrue: yup.boolean(),
						})
					)
					.min(2, 'Минимум 2 ответа'),
			})
		)
		.min(1, 'Минимум 1 вопрос'),
});

const emptyQuestion = {
	title: '',
	points: '',
	isMulAnswers: false,
	answers: [
		{
			text: '',
			isTrue: false,
		},
		{
			text: '',
			isTrue: false,
		},
	],
};

const Tasks = () => {
	const dispatch = useDispatch();
	const { authFetch } = createAuthProvider();
	const history = useHistory();

	const info = useSelector(getUserInfo);
	const [state, setState] = React.useState('');

	const taskBtnHandeler = async (taskId, courseId) => {
		await dispatch(fetchTaskForTeacher(taskId));
		await dispatch(fetchStatisticForTeacher(taskId));
		history.push('/previewTask', { state: courseId });
	};

	const formSubmitHandler = async (data) => {
		setState('Loading');
		try {
			const result = await authFetch('/api/school/newassignment', 'POST', data);
			await dispatch(fetchTeacherCourses());
			setState(result.message);
		} catch (err) {
			setState(err.message);
		}
	};

	return (
		<main className='main'>
			<div className='container'>
				<div className='content'>
					<div className='content__main'>
						{Object.keys(info).length !== 0 ? (
							<Formik
								initialValues={{
									courseID: '',
									title: '',
									desc: '',
									isShuffled: false,
									allowOvertime: false,
									date: '',
									endDate: '',
									questions: [emptyQuestion],
								}}
								validationSchema={validationSchema}
								onSubmit={(values) => {
									formSubmitHandler(values);
								}}>
								{({ values, errors }) => (
									<Form className='form tasks__form'>
										<h3 className='form__title'>Добавить новое задание</h3>
										<fieldset className='form__fieldset'>
											<FormSelect label='Выбирете прдемет' name='courseID'>
												<option value=''>Выберите предмет</option>
												{info.teacherCourses.map((course) => (
													<option key={course._id} value={course._id}>
														{course.title}
													</option>
												))}
											</FormSelect>
										</fieldset>
										<fieldset className='form__fieldset'>
											<FormInput
												label='Название задания'
												name='title'
												type='text'
											/>
										</fieldset>
										<fieldset className='form__fieldset'>
											<FormTextarea label='Описание задания' name='desc' />
										</fieldset>
										<fieldset className='form__fieldset form__fieldset--flex'>
											<fieldset className='form__fieldset'>
												<FormCheckbox
													label='Перемешивать вопросы?'
													name='isShuffled'
												/>
											</fieldset>
											<fieldset className='form__fieldset'>
												<FormCheckbox
													label='Поздняя сдача'
													name='allowOvertime'
												/>
											</fieldset>
										</fieldset>
										<fieldset className='form__fieldset form__fieldset--flex'>
											<fieldset className='form__fieldset'>
												<FormInput
													label='Начало занятия'
													name='date'
													type='date'
												/>
											</fieldset>
											<fieldset className='form__fieldset'>
												<FormInput
													label='Конец занятия'
													name='endDate'
													type='date'
												/>
											</fieldset>
										</fieldset>
										<FieldArray name='questions'>
											{(arrayHelpers) => (
												<TasksQuestions
													values={values.questions}
													helpers={arrayHelpers}
												/>
											)}
										</FieldArray>
										<div className='form__error form-mb'>
											{typeof errors.questions === 'string' ? (
												<>{errors.questions}</>
											) : null}
										</div>
										<button className='btn' type='submit'>
											Добавить новое задание
										</button>
										<span className='form__result'>{state}</span>
									</Form>
								)}
							</Formik>
						) : (
							<Loader text={'Загрузка формы'} />
						)}
					</div>
					<div className='content__aside'>
						{Object.keys(info).length !== 0 ? (
							<div className='tasks__subjects'>
								{info.teacherCourses.length ? (
									info.teacherCourses.map((course) => (
										<div className='subject' key={course._id}>
											<div className='subject__container'>
												<div className='subject__row '>
													<div className='subject__title'>{course.title}</div>
													<div className='subject__container'>
														<span className='mr-10'>{course.price} грн</span>
													</div>
												</div>
												<div
													className='subject__tasks'
													style={{ marginBottom: 0 }}>
													{course.assignments.length ? (
														course.assignments.map((assignment) => (
															<div
																className='subject__task'
																key={assignment._id}>
																<div className='subject__task-name'>
																	{assignment.title}
																</div>
																<button
																	className='btn'
																	type='button'
																	onClick={() =>
																		taskBtnHandeler(assignment._id, course._id)
																	}>
																	Открыть
																</button>
															</div>
														))
													) : (
														<span>Тестов нет</span>
													)}
												</div>
											</div>
										</div>
									))
								) : (
									<span>Курсов нет</span>
								)}
							</div>
						) : (
							<Loader text={'Загрузка тестов'} />
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

export default Tasks;
