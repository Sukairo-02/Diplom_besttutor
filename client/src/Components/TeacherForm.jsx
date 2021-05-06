import React from 'react';
import { Formik, Form } from 'formik';
import { FormSelect, FormTextarea } from './index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../redux/reducers/userInfoSlice';
import { fetchSubjects } from '../redux/reducers/subjectsSlice';
import { createAuthProvider } from '../jwt';
import * as yup from 'yup';

const validationSchema = yup.object({
	subject: yup.string().required('Выберите вашу дисциплину'),
	desc: yup.string().required('Напишите о себе'),
	education: yup.string().required('Напишите о вашем образование'),
	experience: yup.string().required('Напишите о вашей работе'),
});

const TeacherForm = ({ data }) => {
	const [state, setState] = React.useState('');
	const { authFetch } = createAuthProvider();
	const subjects = useSelector((state) => state.subjects.items);

	const dispatch = useDispatch();

	React.useEffect(() => {
		if (!subjects.length) {
			dispatch(fetchSubjects());
		}
	});

	const formSubmitHandler = async (data) => {
		setState('Loading');
		try {
			let response = await authFetch('/api/auth/editteacher', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			let result = await response.json();
			setState(result.message);

			dispatch(fetchUserInfo());

			return result.message;
		} catch (err) {
			setState(err.message);
		}
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
				<span className='form__result'>{state}</span>
			</Form>
		</Formik>
	);
};

export default TeacherForm;
