import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import { updateInfo } from '../../redux/reducers/userInfoSlice';
import { FormFile, FormInput } from '../../Components/index';
import * as yup from 'yup';

const validationSchema = yup.object({
	photo: yup.mixed(),
	username: yup.string(),
	dateOfBirth: yup.string(),
	phone: yup.string().max(13, 'Максимальная длина 13 символов'),
	address: yup.string(),
	area: yup.string(),
	city: yup.string(),
});

const EditForm = ({ data }) => {
	const { request } = useAuthFetch();

	const dispatch = useDispatch();

	const formSubmitHandler = (formData) => {
		request('/api/auth/edit', 'POST', formData, {}, () => {
			dispatch(updateInfo(formData));
		});
	};

	return (
		<Formik
			initialValues={{
				avatar: data.avatar,
				username: data.username,
				email: data.email,
				dateOfBirth: data.dateOfBirth,
				phone: data.phone,
				address: data.address,
				area: data.area,
				city: data.city,
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				formSubmitHandler(values);
			}}
		>
			{(formik) => (
				<Form className='form' encType='multipart/form-data'>
					<fieldset className='form__fieldset form__fieldset--center'>
						<FormFile setFieldValue={formik.setFieldValue} avatar={data.avatar} />
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
							<FormInput label='Телефон' name='phone' type='tel' placeholder='+380982913867' />
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
				</Form>
			)}
		</Formik>
	);
};

EditForm.propTypes = {
	data: PropTypes.object,
};

export default EditForm;
