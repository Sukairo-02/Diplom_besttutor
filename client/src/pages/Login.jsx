import React from 'react';
import { Link } from 'react-router-dom';

import img from '../assets/img/1.webp';

const Login = () => {
	const [form, setForm] = React.useState({
		email: '',
		password: '',
	});

	const inputChangeHandler = (event) => {
		setForm({
			...form,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<main className='sign'>
			<img className='sign__bg' src={img} alt='Фото ученика за компьютером' />

			<div className='sign__info'>
				<h1 className='sign__logo'>Tutor</h1>

				<form className='form form--sign'>
					<h2 className='form__title'>Вход</h2>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='email'>
							Email адрес
						</label>
						<input
							className='form__input'
							id='email'
							type='email'
							name='email'
							onChange={inputChangeHandler}
							required
						/>
					</fieldset>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='password'>
							Пароль{' '}
							{/* <a className='form__link' href='#'>
								Забыли пароль?
							</a> */}
						</label>
						<input
							className='form__input'
							id='password'
							type='password'
							name='password'
							onChange={inputChangeHandler}
							required
						/>
					</fieldset>
					<button className='btn form__btn w-100' type='submit'>
						Войти
					</button>
				</form>

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

export default Login;
