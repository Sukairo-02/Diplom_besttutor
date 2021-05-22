import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { createAuthProvider } from '../../jwt';
import { Formik, Form } from 'formik';
import { FormInput, FormTextarea } from '../index';
import * as yup from 'yup';

const validationSchema = yup.object({
	title: yup.string().required('Название курса обязательно'),
	price: yup.string().required('Цена (грн) обязательно'),
	desc: yup.string().required('Описание курса обязательно'),
});

const TeacherProfileSubjectForm = ({ course }) => {
	const dispatch = useDispatch();
	const { authFetch } = createAuthProvider();

	const publishBtnHandler = async () => {
		try {
			const result = await authFetch('/api/school/publishcourse/', 'POST', {
				courseID: course._id,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const updateBtnHandler = async (data) => {
		try {
			const result = await authFetch('/api/school/editcourse/', 'POST', data);
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const updatePriceBtnHandler = async (data) => {
		try {
			const result = await authFetch('/api/school/editprice/', 'POST', {
				courseID: course._id,
				price: data,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const unblockeBtnHandler = async () => {
		try {
			const result = await authFetch('/api/school/unblockcourse/', 'POST', {
				courseID: course._id,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const blockeBtnHandler = async () => {
		try {
			const result = await authFetch('/api/school/blockcourse/', 'POST', {
				courseID: course._id,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	const deleteBtnHandler = async () => {
		try {
			const result = await authFetch('/api/school/deletecourse/', 'DELETE', {
				courseID: course._id,
			});
			dispatch(fetchTeacherCourses());

			alert(result.message);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<Formik
			initialValues={{
				courseID: course._id,
				subject: course.subject,
				title: course.title,
				price: course.price,
				desc: course.desc,
			}}
			validationSchema={validationSchema}>
			{(formik) => (
				<Form className='form subject__form'>
					<fieldset className='form__fieldset form__fieldset--flex'>
						<fieldset className='form__fieldset'>
							<label className='form__label'>
								Опубликован: {course.isPublished ? '✅' : '❌'}
							</label>
						</fieldset>
						<fieldset className='form__fieldset'>
							<label className='form__label'>
								Заблокирован: {course.isBlocked ? '✅' : '❌'}
							</label>
						</fieldset>
					</fieldset>
					<fieldset className='form__fieldset form__fieldset--flex'>
						<fieldset className='form__fieldset'>
							<FormInput label='Предмет' name='subject' type='text' disabled />
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput label='Название курса' name='title' type='text' />
						</fieldset>
					</fieldset>
					<fieldset className='form__fieldset'>
						<FormInput label='Цена (грн)' name='price' type='number' />
					</fieldset>
					<fieldset className='form__fieldset'>
						<FormTextarea label='Описание курса' name='desc' />
					</fieldset>
					<div className='subject__btns'>
						<button type='button' className='btn' onClick={publishBtnHandler}>
							Опубликовать
						</button>
						<button
							type='button'
							className='btn'
							onClick={() => updateBtnHandler(formik.values)}>
							Обновить
						</button>
						<button
							type='button'
							className='btn'
							onClick={() => updatePriceBtnHandler(formik.values.price)}>
							Обновить цену
						</button>
						<button type='button' className='btn' onClick={unblockeBtnHandler}>
							Разблокировать
						</button>
						<button
							type='button'
							className='btn btn--red'
							onClick={blockeBtnHandler}>
							Заблокировать
						</button>
						<button
							type='button'
							className='btn btn--red'
							onClick={deleteBtnHandler}>
							Удалить
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default TeacherProfileSubjectForm;
