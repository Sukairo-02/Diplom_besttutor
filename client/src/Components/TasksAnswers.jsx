import { FormInput, FormCheckbox } from './index';
import { FieldArray } from 'formik';

const emptyAnswer = {
	text: '',
	isTrue: false,
};

const TasksAnswers = ({ index, values }) => {
	return (
		<FieldArray name={`questions[${index}].answers`}>
			{(arrayHelpers) => (
				<>
					<h4>Ответы</h4>
					{values.map((_, sIndex) => (
						<fieldset
							className='form__fieldset form__fieldset--flex'
							key={sIndex}>
							<span>{sIndex + 1}</span>
							<fieldset className='form__fieldset'>
								<FormInput
									label='Ответ вопроса'
									name={`questions[${index}].answers[${sIndex}].text`}
									type='text'
								/>
							</fieldset>
							<fieldset className='form__fieldset'>
								<FormCheckbox
									label='Правильный ответ?'
									name={`questions[${index}].answers[${sIndex}].isTrue`}
								/>
							</fieldset>
							<button
								type='button'
								title='Удалить ответ'
								className='btn btn--transparent'
								style={{ alignSelf: 'center' }}
								onClick={() => arrayHelpers.remove(sIndex)}>
								&times;
							</button>
						</fieldset>
					))}
					<button
						type='button'
						className='btn btn--transparent'
						onClick={() => arrayHelpers.push(emptyAnswer)}>
						Добавить ответ
					</button>
				</>
			)}
		</FieldArray>
	);
};

export default TasksAnswers;
