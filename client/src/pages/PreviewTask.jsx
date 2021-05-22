import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeacherCourses } from '../redux/reducers/userInfoSlice';
import { createAuthProvider } from '../jwt';

const PreviewTask = ({ location }) => {
	const dispatch = useDispatch();
	const { item, statistic } = useSelector(({ task }) => task);
	const { authFetch } = createAuthProvider();

	const [state, setState] = React.useState('');

	const deleteBtnHandler = async (id) => {
		setState('Loading');
		try {
			const result = await authFetch('/api/school/delassignment', 'DELETE', {
				courseID: location.state.state,
				assignmentID: id,
			});
			await dispatch(fetchTeacherCourses());
			setState(result.message);
		} catch (err) {
			setState(err.message);
		}
	};

	return (
		<main className='main'>
			<div className='container'>
				<div className='content'>
					<div className='content__main'>
						<div className='previewTask'>
							<h2 className='previewTask__title'>{item.title}</h2>
							<p className='previewTask__desc'>{item.desc}</p>
							<span className='previewTask__min-title'>Описание</span>
							<div className='previewTask__info'>
								<div>Перемешано: {item.isShuffled ? '✅' : '❌'}</div>
								<div>Поздняя сдача: {item.allowOvertime ? '✅' : '❌'}</div>
								<div className='previewTask__points'>
									Максимально баллов: {item.maxPoints}
								</div>
								<div>Сдано: {item.submits.length}</div>
							</div>
							<span className='previewTask__min-title'>Время</span>
							<div className='previewTask__dates'>
								<div className='previewTask__date'>
									Начало теста: {item.date.slice(0, 10)}
								</div>
								<div className='previewTask__date'>
									Конец теста: {item.endDate.slice(0, 10)}
								</div>
							</div>
							<span className='previewTask__min-title'>Вопросы</span>
							<div className='questions'>
								{item.questions.map((question) => (
									<div className='question' key={question._id}>
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
											{question.answers.map((answer) => (
												<div className='question__answer' key={answer._id}>
													<div>{answer.text}</div>
													<div>Правильный: {answer.isTrue ? '✅' : '❌'}</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
							<button
								className='btn'
								type='button'
								title={`Удалить тесты ${item.title}`}
								onClick={() => deleteBtnHandler(item._id)}>
								Удалить
							</button>
							<span>{state}</span>
						</div>
					</div>
					<div className='content__aside'>
						<div className='statistic'>
							<h4 className='statistic__title'>Студенты</h4>
							<div className='statistic__students'>
								{statistic.best_students.length ? (
									statistic.best_students.map((student) => (
										<div className='statistic__student' key={student._id}>
											<img
												className='statistic__avatar'
												src={student.avatar}
												alt='Аватар'
											/>
											<div className='statistic__container'>
												<div>{student.username}</div>
												<div>{student.email}</div>
											</div>
											<div>Баллов: {student.points}</div>
										</div>
									))
								) : (
									<div>Студентов нет</div>
								)}
							</div>
							<h4 className='statistic__title'>Вопросы</h4>
							<div className='statistic__questions'>
								{statistic.hardest_questions.length ? (
									statistic.hardest_questions.map((question) => (
										<div className='statistic__question'>
											<h4>{question.title}</h4>
											<div>Количество баллов: {question.points}</div>
											<div>Правильных ответов: {question.correct_answers}</div>
										</div>
									))
								) : (
									<div>Вопросов нет</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default PreviewTask;
