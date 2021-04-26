import React from 'react';
import { Link } from 'react-router-dom';

import { useHttp } from '../hooks/http.hook';
import img from '../assets/img/2.webp';

const Signup = () => {
	const { loading, request } = useHttp();
	const [form, setForm] = React.useState({
		isTeacher: 'false',
		email: '',
		username: '',
		dateOfBirth: '',
		password: '',
	});

	const inputChangeHandler = (event) => {
		setForm({
			...form,
			[event.target.name]: event.target.value,
		});
	};

	const formHandler = async (event) => {
		event.preventDefault();

		try {
			const data = await request('/api/auth/register', 'POST', { ...form });
			await request('/api/auth/sendValidation', 'POST', {
				email: form.email,
			});
			alert(data.message);
		} catch (e) {
			alert(e.message);
		}
	};

	return (
		<main className='sign'>
			<img className='sign__bg' src={img} alt='Фото ученика за компьютером' />

			<div className='sign__info'>
				<h1 className='sign__logo'>Tutor</h1>

				<form className='form form--sign' onSubmit={formHandler}>
					<h2 className='form__title'>Регистрация</h2>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='isTeacher'>
							Ваша роль
						</label>
						<select
							className='form__select'
							name='isTeacher'
							id='isTeacher'
							required
							onChange={inputChangeHandler}>
							<option value='false'>Ученик</option>
							<option value='true'>Учитель</option>
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
							<label className='form__label' htmlFor='username'>
								Имя и Фамилия
							</label>
							<input
								className='form__input'
								id='username'
								type='text'
								name='username'
								required
								onChange={inputChangeHandler}
							/>
						</fieldset>
					</fieldset>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='dateOfBirth'>
							Дата рождения
						</label>
						<input
							className='form__input'
							id='dateOfBirth'
							type='date'
							name='dateOfBirth'
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
					<button
						className='btn form__btn w-100'
						type='submit'
						disabled={loading}>
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
