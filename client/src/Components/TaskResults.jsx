const TaskResults = ({ results }) => {
	return (
		<div className='questions'>
			<h4 className='question__title'>Количество баллов: {results.points}</h4>
			{results.questions.map((question) => (
				<div className='question' key={question.qID}>
					<h4 className='question__title'>{question.title}</h4>
					<div className='question__info'>
						<div className='question__points'>
							Количество баллов: {question.points}
						</div>
						<div>Множество ответов: {question.isMulAnswers ? '✅' : '❌'}</div>
						<div>Правильно: {question.isCorrect ? '✅' : '❌'}</div>
					</div>
					<div className='question__answers'>
						{question.answers.map((answer) => (
							<div
								className={
									'question__answer ' +
									(answer.isChecked ? 'question__answer--checked' : '')
								}
								key={answer._id}>
								<div>{answer.text}</div>
								<div>{answer.isCorrect === answer.isChecked ? '✔️' : '❌'}</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default TaskResults;
