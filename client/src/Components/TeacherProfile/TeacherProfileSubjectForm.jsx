import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import { FormInput, FormTextarea } from '../index';
import * as yup from 'yup';

const validationSchema = yup.object({
	title: yup.string().required('Название курса обязательно'),
	price: yup.string().required('Цена (грн) обязательно'),
	desc: yup.string().required('Описание курса обязательно'),
});

const TeacherProfileSubjectForm = ({ course }) => {
	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const publishBtnHandler = () => {
		request('/api/school/publishcourse/', 'POST', {
			courseID: course._id,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	const updateBtnHandler = (data) => {
		request('/api/school/editcourse/', 'POST', data).then(() =>
			dispatch(fetchTeacherCourses())
		);
	};

	const updatePriceBtnHandler = (data) => {
		request('/api/school/editprice/', 'POST', {
			courseID: course._id,
			price: data,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	const unblockeBtnHandler = () => {
		request('/api/school/unblockcourse/', 'POST', {
			courseID: course._id,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	const blockeBtnHandler = () => {
		request('/api/school/blockcourse/', 'POST', {
			courseID: course._id,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	const deleteBtnHandler = () => {
		request('/api/school/deletecourse/', 'DELETE', {
			courseID: course._id,
		}).then(() => dispatch(fetchTeacherCourses()));
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

TeacherProfileSubjectForm.propTypes = {
	course: PropTypes.object,
};

export default TeacherProfileSubjectForm;
