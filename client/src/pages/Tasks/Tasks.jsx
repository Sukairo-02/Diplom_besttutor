import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik, Form, FieldArray } from 'formik';
import { nanoid } from '@reduxjs/toolkit';
import {
	fetchTeacherCourses,
	selectAllTeacherCourses,
	teacherAssignmentAdd,
} from '../../redux/reducers/userInfoSlice';
import {
	fetchTaskForTeacher,
	fetchStatisticForTeacher,
} from '../../redux/reducers/taskSlice';
import { getUserInfo } from '../../redux/selectors';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import TasksQuestions from './TasksQuestions';
import TasksAssignment from './TasksAssignment';
import {
	FormInput,
	FormTextarea,
	FormCheckbox,
	FormSelect,
	Loader,
} from '../../Components';
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

export const Tasks = () => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();
	const history = useHistory();

	const info = useSelector(getUserInfo);
	const teacherCourses = useSelector(selectAllTeacherCourses);

	React.useEffect(() => {
		if (info.teacherCourses.length && !teacherCourses.length) {
			dispatch(fetchTeacherCourses());
		}
	});

	const openTaskHandeler = async (taskID, courseID) => {
		await dispatch(fetchTaskForTeacher(taskID));
		await dispatch(fetchStatisticForTeacher(taskID));
		history.push('/previewTask', { taskID, courseID });
	};

	const formSubmitHandler = async (formData, actions) => {
		request('/api/school/newassignment', 'POST', formData, {}, () => {
			const id = nanoid();
			dispatch(
				teacherAssignmentAdd({
					courseID: formData.courseID,
					assignmentID: id,
					data: {
						_id: id,
						...formData,
					},
				})
			);
			actions.resetForm();
		});
	};

	return (
		<main className='main'>
			<div className='container'>
				<div className='content'>
					{info.teacherCourses.length ? (
						<>
							<div className='content__main'>
								{teacherCourses.length ? (
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
										onSubmit={(values, actions) => {
											formSubmitHandler(values, actions);
										}}>
										{({ values, errors }) => (
											<Form className='form tasks__form'>
												<h3 className='form__title'>Добавить новое задание</h3>
												<fieldset className='form__fieldset'>
													<FormSelect label='Выбирете прдемет' name='courseID'>
														<option value=''>Выберите предмет</option>
														{teacherCourses.map((course) => (
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
											</Form>
										)}
									</Formik>
								) : (
									<Loader text={'Загрузка формы'} />
								)}
							</div>
							<div className='content__aside'>
								{teacherCourses.length ? (
									<div className='tasks__subjects'>
										{teacherCourses.map((course) => (
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
														{course.assignmentsIds.length ? (
															course.assignmentsIds.map((assignmentID) => (
																<TasksAssignment
																	key={assignmentID}
																	assignmentID={assignmentID}
																	courseID={course._id}
																	openTaskHandeler={openTaskHandeler}
																/>
															))
														) : (
															<div>Заданий нет</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<Loader text='Загрузка заданий' />
								)}
							</div>
						</>
					) : (
						<div>Созданных курсов нет</div>
					)}
				</div>
			</div>
		</main>
	);
};
