import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getStatistic } from '../../redux/selectors';
import { fetchTeacherCourses } from '../../redux/reducers/userInfoSlice';
import { useAuthFetch } from '../../hooks/authFetch.hook';

export const PreviewTask = ({ location }) => {
	const item = useSelector(getTask);
	const statistic = useSelector(getStatistic);

	const dispatch = useDispatch();
	const { request } = useAuthFetch();

	const deleteBtnHandler = (id) => {
		request('/api/school/delassignment', 'DELETE', {
			courseID: location.state.state,
			assignmentID: id,
		}).then(() => dispatch(fetchTeacherCourses()));
	};

	return (
		<main className='main'>
			<div className='container'>
				<div className='content'>
					<div className='content__main'>
						<div className='task'>
							<h2 className='task__title'>{item.title}</h2>
							<p className='task__desc'>{item.desc}</p>
							<span className='task__min-title'>Описание</span>
							<div className='task__info'>
								<div>Перемешано: {item.isShuffled ? '✅' : '❌'}</div>
								<div>Поздняя сдача: {item.allowOvertime ? '✅' : '❌'}</div>
								<div className='task__points'>
									Максимально баллов: {item.maxPoints}
								</div>
								<div>Сдано: {item.submits.length}</div>
							</div>
							<span className='task__min-title'>Время</span>
							<div className='task__times'>
								<div className='task__time'>Начало теста: {item.date}</div>
								<div className='task__time'>Конец теста: {item.endDate}</div>
							</div>
							<span className='task__min-title'>Вопросы</span>
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
												<div className='statistic__name'>
													{student.username}
												</div>
												<div className='statistic__email'>{student.email}</div>
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
										<div className='statistic__question' key={question.qID}>
											<h5>{question.title}</h5>
											<div>Баллов: {question.points}</div>
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