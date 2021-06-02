import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { createAuthProvider } from '../jwt';
import { FormCheckbox } from './index';
import * as yup from 'yup';

const validationSchema = yup.object({
	assignmentID: yup.string().required(),
	questions: yup.array(
		yup.object({
			answers: yup
				.array(
					yup.object({
						isChecked: yup.boolean(),
					})
				)
				.test('Выбран ответ ?', 'Не выбран ответ', (answers) => {
					let sum = 0;
					for (let i = 0; i < answers.length; i++) {
						if (answers[i]?.isChecked) {
							sum += 1;
						}
					}

					if (!sum) return false;

					return true;
				}),
		})
	),
});

const TaskForm = ({ item, setSubmit }) => {
	const [state, setState] = React.useState('');

	const { authFetch } = createAuthProvider();

	const formSubmitHandler = async (data) => {
		setState('Loading');
		try {
			const result = await authFetch('/api/school/submit', 'POST', data);
			setState(result.message);
			setSubmit(true);
		} catch (err) {
			setState(err.message);
		}
	};

	return (
		<Formik
			initialValues={{
				assignmentID: item._id,
				questions: item.questions,
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				formSubmitHandler(values);
			}}>
			{({ errors }) => (
				<Form className='form'>
					<FieldArray name='questions'>
						<div className='questions'>
							{item.questions.map((question, index) => (
								<div className='question' key={question.qID}>
									<h4 className='question__title'>{question.title}</h4>
									<div className='question__info'>
										<div className='question__points'>
											Количество баллов: {question.points}
										</div>
										<div>
											Множество ответов: {question.isMulAnswers ? '✅' : '❌'}
										</div>
									</div>
									<div className='question__answers'>
										<FieldArray name={`questions[${index}].answers`}>
											<>
												{question.answers.map((answer, sIndex) => (
													<fieldset className='form__fieldset' key={answer.nID}>
														<FormCheckbox
															label={answer.text}
															name={`questions[${index}].answers[${sIndex}].isChecked`}
														/>
													</fieldset>
												))}
											</>
										</FieldArray>
									</div>
								</div>
							))}
						</div>
					</FieldArray>
					<div className='form__error form-mb'>
						{errors?.questions &&
							errors.questions.map((question, index) =>
								question ? (
									<div key={index}>
										{question?.answers} в {index + 1} вопросе
									</div>
								) : (
									''
								)
							)}
					</div>
					<button className='btn' type='submit'>
						Отправить
					</button>
					<span className='form__result'>{state}</span>
				</Form>
			)}
		</Formik>
	);
};

export default TaskForm;
