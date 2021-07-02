import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useFetch } from '../../hooks/fetch.hook';
import { createAuthProvider } from '../../jwt';
import { FormInput } from '../../Components';
import * as yup from 'yup';
import img from '../../assets/img/1.webp';

const validationSchema = yup.object({
	email: yup
		.string()
		.email('Введите коректный email')
		.required('Email обязательное поле'),
	password: yup
		.string()
		.min(4, 'Минимальная длина 6')
		.required('Пароль обязательное поле'),
});

export const Login = () => {
	const { loading, request } = useFetch();
	const { login } = createAuthProvider();

	const formHandler = (values) => {
		request('/api/auth/login', 'POST', values, {}, (data) => {
			login(data);
			document.location.reload();
		});
	};

	return (
		<main className='sign'>
			<img className='sign__bg' src={img} alt='Фото ученика за компьютером' />

			<div className='sign__info'>
				<h1 className='sign__logo'>BestTutor</h1>

				<Formik
					initialValues={{
						email: '',
						password: '',
					}}
					validationSchema={validationSchema}
					onSubmit={(values) => {
						formHandler(values);
					}}>
					<Form className='form form--sign'>
						<h2 className='form__title'>Вход</h2>
						<fieldset className='form__fieldset'>
							<FormInput label='Email адрес' name='email' type='email' />
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput
								label='Пароль'
								html="<a className='form__link' href='#'>Забыли пароль?</a>"
								name='password'
								type='password'
							/>
						</fieldset>
						<button
							className='btn form__btn w-100'
							type='submit'
							disabled={loading}>
							Войти
						</button>
					</Form>
				</Formik>

				<footer className='sign__footer'>
					Нет аккаунта{' '}
					<Link className='sign__link' to='/signup'>
						Зарегистрируйтесь
					</Link>
				</footer>
			</div>
		</main>
	);
};
