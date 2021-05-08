import React from 'react';
import { Formik, Form } from 'formik';
import { FormFile, FormInput } from './index';
import { createAuthProvider } from '../jwt';
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from '../redux/reducers/userInfoSlice';
import * as yup from 'yup';

const validationSchema = yup.object({
	photo: yup.mixed(),
	username: yup.string(),
	dateOfBirth: yup.string(),
	phone: yup.string().max(10),
	address: yup.string(),
	area: yup.string(),
	city: yup.string(),
});

const EditForm = ({ data }) => {
	const [state, setState] = React.useState('');
	const { authFetch } = createAuthProvider();

	const dispatch = useDispatch();

	const formSubmitHandler = async (data) => {
		setState('Loading');
		try {
			let response = await authFetch('/api/auth/edit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			let result = await response.json();
			setState(result.message);

			dispatch(fetchUserInfo());

			return result.message;
		} catch (err) {
			setState(err.message);
		}
	};

	return (
		<Formik
			initialValues={{
				avatar: data.avatar,
				username: data.username,
				email: data.email,
				dateOfBirth: data.dateOfBirth.slice(0, 10),
				phone: data.phone,
				address: data.address,
				area: data.area,
				city: data.city,
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				formSubmitHandler(values);
			}}>
			{(formik) => (
				<Form className='form' encType='multipart/form-data'>
					<fieldset className='form__fieldset form__fieldset--center'>
						<FormFile
							setFieldValue={formik.setFieldValue}
							avatar={data.avatar}
						/>
					</fieldset>
					<fieldset className='form__fieldset '>
						<FormInput label='Имя и Фамилия' name='username' type='text' />
					</fieldset>
					<fieldset className='form__fieldset'>
						<FormInput label='Email адрес' name='email' type='email' disabled />
					</fieldset>
					<fieldset className='form__fieldset'>
						<FormInput label='Дата рождения' name='dateOfBirth' type='date' />
					</fieldset>
					<fieldset className='form__fieldset form__fieldset--flex'>
						<fieldset className='form__fieldset'>
							<FormInput label='Телефон' name='phone' type='tel' />
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput label='Адрес' name='address' type='text' />
						</fieldset>
					</fieldset>
					<fieldset className='form__fieldset form__fieldset--flex'>
						<fieldset className='form__fieldset'>
							<FormInput label='Область' name='area' type='text' />
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput label='Город' name='city' type='text' />
						</fieldset>
					</fieldset>
					<button className='btn' type='submit'>
						Сохранить
					</button>
					<span className='form__result'>{state}</span>
				</Form>
			)}
		</Formik>
	);
};

export default EditForm;
