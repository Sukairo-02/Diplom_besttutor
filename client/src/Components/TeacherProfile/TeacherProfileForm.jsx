import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { Formik, Form } from 'formik';
import { FormInput, FormTextarea } from '../index';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import * as yup from 'yup';

const validationSchema = yup.object({
	title: yup.string().required('Название курса обязательно'),
	price: yup
		.number('Цена должна быть указана в цифрах')
		.positive('Цена должна быть больше 0')
		.required('Цена (грн) обязательно'),
	desc: yup.string().required('Описание курса обязательно'),
});

const TeacherProfileForm = () => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const formSubmitHandler = (formData) => {
		request('/api/school/newcourse', 'POST', formData).then(() =>
			dispatch(fetchTeacherCourses())
		);
	};

	return (
		<Formik
			initialValues={{
				title: '',
				price: '',
				desc: '',
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				formSubmitHandler(values);
			}}>
			<Form className='form teacher-profile__form'>
				<h3 className='form__title'>Добавить новый курс</h3>
				<fieldset className='form__fieldset'>
					<FormInput label='Название курса' name='title' type='text' />
				</fieldset>
				<fieldset className='form__fieldset'>
					<FormInput label='Цена (грн)' name='price' type='number' />
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
};

export default TeacherProfileForm;
