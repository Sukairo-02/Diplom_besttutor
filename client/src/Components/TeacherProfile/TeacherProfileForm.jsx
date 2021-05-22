import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { Formik, Form } from 'formik';
import { FormInput, FormTextarea } from '../index';
import { createAuthProvider } from '../../jwt';
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
	const [state, setState] = React.useState('');
	const { authFetch } = createAuthProvider();

	const formSubmitHandler = async (data) => {
		setState('Loading');
		try {
			const result = await authFetch('/api/school/newcourse', 'POST', data);
			setState(result.message);

			dispatch(fetchTeacherCourses());
		} catch (err) {
			setState(err.message);
		}
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
				<h3>Добавить новый курс</h3>
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
				<span className='form__result'>{state}</span>
			</Form>
		</Formik>
	);
};

export default TeacherProfileForm;
