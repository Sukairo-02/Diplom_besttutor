import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useFetch } from '../../hooks/fetch.hook';
import { FormInput, FormSelect } from '../../Components';
import * as yup from 'yup';
import img from '../../assets/img/2.webp';

const validationSchema = yup.object({
	isTeacher: yup.string(),
	email: yup
		.string()
		.email('Введите коректный email')
		.required('Email обязательное поле'),
	username: yup
		.string()
		.max(30, 'Макс длина 30')
		.required('Введите имя и фамилию'),
	dateOfBirth: yup.string().required('Выберите дату'),
	password: yup
		.string()
		.min(6, 'Минимальная длина 6')
		.required('Password обязательное поле'),
});

export const Signup = () => {
	const { loading, request } = useFetch();

	const formHandler = (values) => {
		request('/api/auth/register', 'POST', values, {}, (data) => {
			request('/api/auth/sendValidation', 'POST', {
				email: values.email,
			});
			alert(data.message);
		});
	};

	return (
		<main className='sign'>
			<img className='sign__bg' src={img} alt='Фото ученика за компьютером' />

			<div className='sign__info'>
				<h1 className='sign__logo'>BestTutor</h1>

				<Formik
					initialValues={{
						isTeacher: 'false',
						email: '',
						username: '',
						dateOfBirth: '',
						password: '',
					}}
					validationSchema={validationSchema}
					onSubmit={(values) => {
						formHandler(values);
					}}>
					<Form className='form form--sign'>
						<h2 className='form__title'>Регистрация</h2>
						<fieldset className='form__fieldset'>
							<FormSelect label='Ваша роль' name='isTeacher'>
								<option value='false'>Ученик</option>
								<option value='true'>Учитель</option>
							</FormSelect>
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput label='Email адрес' name='email' type='email' />
						</fieldset>
						<fieldset className='form__fieldset form__fieldset--flex'>
							<fieldset className='form__fieldset'>
								<FormInput label='Имя и Фамилия' name='username' type='text' />
							</fieldset>
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput label='Дата рождения' name='dateOfBirth' type='date' />
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput label='Пароль' name='password' type='password' />
						</fieldset>
						<button
							className='btn form__btn w-100'
							type='submit'
							disabled={loading}>
							Зарегистрироваться
						</button>
					</Form>
				</Formik>

				<footer className='sign__footer'>
					Есть аккаунт?{' '}
					<Link className='sign__link' to='/login'>
						Войдите
					</Link>
				</footer>
			</div>
		</main>
	);
};
