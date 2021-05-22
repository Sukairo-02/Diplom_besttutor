import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { Formik, Form } from 'formik';
import { FormInput, FormSelect } from '../index';
import { createAuthProvider } from '../../jwt';
import * as yup from 'yup';

const validationSchema = yup.object({
	location: yup.string().required('Выберите тип урока'),
	date: yup.date().required('Выберите начало урока'),
	endDate: yup.date().required('Выберите конец урока'),
});

const TeacherProfileLessonsForm = ({ id }) => {
	const dispatch = useDispatch();
	const [state, setState] = React.useState('');
	const { authFetch } = createAuthProvider();

	const formSubmitHandler = async (data) => {
		setState('Loading');
		try {
			const result = await authFetch('/api/school/newlesson/', 'POST', data);
			setState(result.message);

			dispatch(fetchTeacherCourses());
		} catch (err) {
			setState(err.message);
		}
	};

	return (
		<Formik
			initialValues={{
				courseID: id,
				location: '',
				date: '',
				endDate: '',
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				formSubmitHandler(values);
			}}>
			<Form className='form teacher-profile__form'>
				<fieldset className='form__fieldset'>
					<FormSelect label='Тип урока' name='location'>
						<option value=''>Тип урока</option>
						<option value='Онлайн'>Онлайн</option>
						<option value='Офлайн'>Офлайн</option>
					</FormSelect>
				</fieldset>
				<fieldset className='form__fieldset form__fieldset--flex'>
					<fieldset className='form__fieldset'>
						<FormInput label='Начало занятия' name='date' type='date' />
					</fieldset>
					<fieldset className='form__fieldset'>
						<FormInput label='Конец занятия' name='endDate' type='date' />
					</fieldset>
				</fieldset>
				<button className='btn' type='submit'>
					Добавить
				</button>
				<span className='form__result'>{state}</span>
			</Form>
		</Formik>
	);
};

export default TeacherProfileLessonsForm;
