import React from 'react';
import { Link } from 'react-router-dom';

import img from '../assets/img/2.webp';

const Signup = () => {
	const [form, setForm] = React.useState({
		role: 'Ученик',
		email: '',
		name: '',
		date: '',
		password: '',
	});

	const inputChangeHandler = (event) => {
		setForm({
			...form,
			[event.target.name]: event.target.value,
		});
	};

	const formHandler = (event) => {
		event.preventDefault();

		console.log(form);
	};

	return (
		<main className='sign'>
			<img className='sign__bg' src={img} alt='Фото ученика за компьютером' />

			<div className='sign__info'>
				<h1 className='sign__logo'>Tutor</h1>

				<form className='form form--sign' onSubmit={formHandler}>
					<h2 className='form__title'>Регистрация</h2>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='role'>
							Ваша роль
						</label>
						<select
							className='form__select'
							name='role'
							id='editSubject'
							required
							onChange={inputChangeHandler}>
							<option value='Ученик'>Ученик</option>
							<option value='Учитель'>Учитель</option>
						</select>
					</fieldset>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='email'>
							Email адрес
						</label>
						<input
							className='form__input'
							id='email'
							type='email'
							name='email'
							required
							onChange={inputChangeHandler}
						/>
					</fieldset>
					<fieldset className='form__fieldset form__fieldset--flex'>
						<fieldset className='form__fieldset'>
							<label className='form__label' htmlFor='name'>
								Имя и Фамилия
							</label>
							<input
								className='form__input'
								id='name'
								type='text'
								name='name'
								required
								onChange={inputChangeHandler}
							/>
						</fieldset>
					</fieldset>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='date'>
							Дата рождения
						</label>
						<input
							className='form__input'
							id='date'
							type='date'
							name='date'
							required
							onChange={inputChangeHandler}
						/>
					</fieldset>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='password'>
							Пароль
						</label>
						<input
							className='form__input'
							id='password'
							type='password'
							name='password'
							required
							onChange={inputChangeHandler}
						/>
					</fieldset>
					<button className='btn form__btn w-100' type='submit'>
						Зарегистрироваться
					</button>
				</form>

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

export default Signup;
