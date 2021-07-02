import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { FormSelect, FormTextarea } from '../../Components/index';
import { useDispatch, useSelector } from 'react-redux';
import { updateInfo } from '../../redux/reducers/userInfoSlice';
import { fetchSubjects } from '../../redux/reducers/subjectsSlice';
import { getSubjects } from '../../redux/selectors';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import * as yup from 'yup';

const validationSchema = yup.object({
	subject: yup.string().required('Выберите вашу дисциплину'),
	desc: yup.string().required('Напишите о себе'),
	education: yup.string().required('Напишите о вашем образование'),
	experience: yup.string().required('Напишите о вашей работе'),
});

const TeacherForm = ({ data }) => {
	const subjects = useSelector(getSubjects);

	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	React.useEffect(() => {
		if (!subjects.length) {
			dispatch(fetchSubjects());
		}
	});

	const formSubmitHandler = (formData) => {
		request('/api/auth/editteacher', 'POST', formData, {}, () => {
			dispatch(updateInfo(formData));
		});
	};

	return (
		<Formik
			initialValues={{
				subject: data.subject,
				desc: data.desc,
				education: data.education,
				experience: data.experience,
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				formSubmitHandler(values);
			}}>
			<Form className='form'>
				<fieldset className='form__fieldset'>
					<FormSelect label='Предмет' name='subject'>
						<option value=''>Выберите предмет</option>
						{subjects.map((subject) => (
							<option key={subject._id} value={subject.name}>
								{subject.name}
							</option>
						))}
					</FormSelect>
				</fieldset>
				<fieldset className='form__fieldset'>
					<FormTextarea label='Описание о себе' name='desc' />
				</fieldset>
				<fieldset className='form__fieldset'>
					<FormTextarea label='Образование' name='education' />
				</fieldset>
				<fieldset className='form__fieldset'>
					<FormTextarea label='Работа' name='experience' />
				</fieldset>
				<button className='btn' type='submit'>
					Сохранить
				</button>
			</Form>
		</Formik>
	);
};

TeacherForm.propTypes = {
	data: PropTypes.object,
};

export default TeacherForm;
