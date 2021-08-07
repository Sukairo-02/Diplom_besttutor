import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { nanoid } from '@reduxjs/toolkit';
import { teacherCourseAdd } from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import { FormInput, FormTextarea } from '../../Components';
import * as yup from 'yup';

const validationSchema = yup.object({
	title: yup.string().required('Название курса обязательно'),
	price: yup
		.number('Цена должна быть указана в цифрах')
		.positive('Цена должна быть больше 0')
		.required('Цена (грн) обязательно'),
	desc: yup.string().required('Описание курса обязательно'),
});

const TeacherProfileForm = React.memo(({ teacherId, teacherSubject }) => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const formSubmitHandler = (formData, actions) => {
		request('/api/school/newcourse', 'POST', formData, {}, () => {
			dispatch(
				teacherCourseAdd({
					...formData,
					_id: nanoid(),
					isBlocked: false,
					isPublished: false,
					subject: teacherSubject,
					teacher: teacherId,
					lessonsIds: [],
					assignmentsIds: [],
					usersdataIds: [],
				})
			);
			actions.resetForm();
		});
	};

	return (
		<Formik
			initialValues={{
				title: '',
				price: '',
				desc: '',
			}}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				formSubmitHandler(values, actions);
			}}
		>
			<Form className='form teacher-profile__form'>
				<h3 className='form__title'>Добавить новый курс</h3>
				<fieldset className='form__fieldset'>
					<FormInput label='Название курса' name='title' type='text' />
				</fieldset>
				<fieldset className='form__fieldset'>
					<FormInput label='Цена (грн)' name='price' type='number' min='0' />
				</fieldset>
				<fieldset className='form__fieldset'>
					<FormTextarea label='Описание курса' name='desc' />
				</fieldset>
				<button className='btn' type='submit'>
					Добавить
				</button>
			</Form>
		</Formik>
	);
});

TeacherProfileForm.propTypes = {
	teacherId: PropTypes.string,
	teacherSubject: PropTypes.string,
};

export default TeacherProfileForm;
