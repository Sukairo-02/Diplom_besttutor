import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { Formik, Form } from 'formik';
import { FormInput, FormSelect } from '../index';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import * as yup from 'yup';

const validationSchema = yup.object({
	location: yup.string().required('Выберите тип урока'),
	date: yup.date().required('Выберите начало урока'),
	endDate: yup.date().required('Выберите конец урока'),
});

const TeacherProfileLessonsForm = ({ id }) => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const formSubmitHandler = (formData) => {
		request('/api/school/newlesson/', 'POST', formData).then(() =>
			dispatch(fetchTeacherCourses())
		);
	};

	return (
		<Formik
			initialValues={{
				courseID: id,
				location: '',
				date: '',
				endDate: '',
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				formSubmitHandler(values);
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
};

TeacherProfileLessonsForm.propTypes = {
	id: PropTypes.string,
};

export default TeacherProfileLessonsForm;
