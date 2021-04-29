import React from 'react';
import { Edit } from '../icons';

const EditProfile = () => {
	return (
		<main className='main'>
			<div className='container'>
				<div className='content'>
					<div className='content__main'>
						<div className='edit-form edit-form--big'>
							<form className='form' encType='multipart/form-data'>
								<fieldset className='form__fieldset form__fieldset--center'>
									<input type='hidden' name='MAX_FILE_SIZE' value='5242880' />
									<input
										className='form__file'
										id='editPhotoInput'
										type='file'
										name='editPhoto'
									/>
									<label htmlFor='editPhotoInput' className='form__drop-zone'>
										Загрузите или перетащите сюда фото
										<img
											src=''
											alt=''
											id='editPhotoImg'
											className='form__img'
										/>
										<div className='form__edit'>
											<Edit />
										</div>
									</label>
								</fieldset>
								<fieldset className='form__fieldset form__fieldset--flex'>
									<fieldset className='form__fieldset'>
										<label className='form__label' htmlFor='editName'>
											Имя
										</label>
										<input
											className='form__input'
											id='editName'
											type='text'
											name='editName'
										/>
									</fieldset>
									<fieldset className='form__fieldset'>
										<label className='form__label' htmlFor='editSurname'>
											Фамилия
										</label>
										<input
											className='form__input'
											id='editSurname'
											type='text'
											name='editSurname'
										/>
									</fieldset>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='editEmail'>
										Email адрес
									</label>
									<input
										className='form__input'
										id='editEmail'
										type='email'
										name='editEmail'
									/>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='editDate'>
										Дата рождения
									</label>
									<input
										className='form__input'
										id='editDate'
										type='date'
										name='editDate'
									/>
								</fieldset>
								<fieldset className='form__fieldset form__fieldset--flex'>
									<fieldset className='form__fieldset'>
										<label className='form__label' htmlFor='editPhone'>
											Телефон
										</label>
										<input
											className='form__input'
											id='editPhone'
											type='tel'
											name='editPhone'
										/>
									</fieldset>
									<fieldset className='form__fieldset'>
										<label className='form__label' htmlFor='editAddress'>
											Адрес
										</label>
										<input
											className='form__input'
											id='editAddress'
											type='text'
											name='editAddress'
										/>
									</fieldset>
								</fieldset>
								<fieldset className='form__fieldset form__fieldset--flex'>
									<fieldset className='form__fieldset'>
										<label className='form__label' htmlFor='editRegion'>
											Область
										</label>
										<input
											className='form__input'
											id='editRegion'
											type='phone'
											name='editRegion'
										/>
									</fieldset>
									<fieldset className='form__fieldset'>
										<label className='form__label' htmlFor='editCity'>
											Город
										</label>
										<input
											className='form__input'
											id='editCity'
											type='text'
											name='editCity'
										/>
									</fieldset>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='editPassword'>
										Пароль
									</label>
									<input
										className='form__input'
										id='editPassword'
										type='password'
										name='editPassword'
									/>
								</fieldset>
								<button className='btn' type='submit'>
									Сохранить
								</button>
							</form>
						</div>
					</div>
					<aside className='content__aside'>
						<div className='edit-form edit-form--little'>
							<form className='form'>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='editSubject'>
										Предмет
									</label>
									<select
										className='form__select'
										name='editSubject'
										id='editSubject'>
										<option value='Японский'>Японский</option>
										<option value='Русский'>Русский</option>
										<option value='Украинский'>Украинский</option>
										<option value='Итальянский'>Итальянский</option>
										<option value='Испанский'>Испанский</option>
										<option value='Норвежский'>Норвежский</option>
										<option value='Корейский'>Корейский</option>
									</select>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='editDesc'>
										Описание о себе
									</label>
									<textarea
										className='form__desc'
										name='editDesc'
										id='editDesc'></textarea>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='editEducation'>
										Образование
									</label>
									<textarea
										className='form__desc'
										name='editEducation'
										id='editEducation'></textarea>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='editWork'>
										Работа
									</label>
									<textarea
										className='form__desc'
										name='editWork'
										id='editWork'></textarea>
								</fieldset>
								<button className='btn' type='submit'>
									Сохранить
								</button>
							</form>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
};

export default EditProfile;
