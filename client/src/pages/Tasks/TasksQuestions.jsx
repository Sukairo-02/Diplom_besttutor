import TasksAnswers from './TasksAnswers';
import { FormInput, FormCheckbox } from '../../Components';

const emptyQuestion = {
	title: '',
	points: '',
	isMulAnswers: false,
	answers: [
		{
			text: '',
			isTrue: false,
		},
		{
			text: '',
			isTrue: false,
		},
	],
};

const TasksQuestions = ({ values, helpers }) => {
	return (
		<div className='form__container'>
			<h4 className='form__title'>Все вопросы</h4>
			{values.map((question, index) => (
				<div className='form__question' key={index}>
					<fieldset className='form__fieldset form__fieldset--flex'>
						<fieldset className='form__fieldset'>
							<FormInput
								label='Название вопроса'
								name={`questions[${index}].title`}
								type='text'
							/>
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormInput
								label='Количество баллов'
								name={`questions[${index}].points`}
								type='number'
							/>
						</fieldset>
						<fieldset className='form__fieldset'>
							<FormCheckbox
								label='Несколько ответов'
								name={`questions[${index}].isMulAnswers`}
							/>
						</fieldset>
						<button
							type='button'
							title='Удалить вопрос'
							className='btn btn--transparent'
							style={{ alignSelf: 'center' }}
							onClick={() => helpers.remove(index)}>
							&times;
						</button>
					</fieldset>
					<TasksAnswers index={index} values={question.answers} />
				</div>
			))}
			<button
				type='button'
				className='btn btn--transparent'
				onClick={() => helpers.push(emptyQuestion)}>
				Добавить вопрос
			</button>
		</div>
	);
};

export default TasksQuestions;
