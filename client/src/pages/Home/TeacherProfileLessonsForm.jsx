import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { nanoid } from '@reduxjs/toolkit';
import { teacherLessonAdd } from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import { FormInput, FormSelect } from '../../Components';
import * as yup from 'yup';

const validationSchema = yup.object({
	location: yup.string().required('Выберите тип урока'),
	date: yup.date().required('Выберите начало урока'),
	endDate: yup.date().required('Выберите конец урока'),
});

const TeacherProfileLessonsForm = React.memo(({ courseID }) => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const formSubmitHandler = (formData, actions) => {
		request('/api/school/newlesson/', 'POST', formData, {}, () => {
			const id = nanoid();
			dispatch(
				teacherLessonAdd({
					courseID,
					lessonID: id,
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
		<Formik
			initialValues={{
				courseID: courseID,
				location: '',
				date: '',
				endDate: '',
			}}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				formSubmitHandler(values, actions);
			}}>
			<Form className='form teacher-profile__form'>
				<fieldset className='form__fieldset'>
					<FormSelect label='Тип урока' name='location'>
						<option value=''>Тип урока</option>
						<option value='Онлайн'>Онлайн</option>
						<option value='Офлайн'>Офлайн</option>
					</FormSelect>
				</fieldset>
				<fieldset className='form__fieldset form__fieldset--flex'>
					<fieldset className='form__fieldset'>
						<FormInput label='Начало занятия' name='date' type='date' />
					</fieldset>
					<fieldset className='form__fieldset'>
						<FormInput label='Конец занятия' name='endDate' type='date' />
					</fieldset>
				</fieldset>
				<button className='btn' type='submit'>
					Добавить
				</button>
			</Form>
		</Formik>
	);
});

TeacherProfileLessonsForm.propTypes = {
	courseID: PropTypes.string,
};

export default TeacherProfileLessonsForm;
