import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTask } from '../../redux/selectors';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import TaskForm from './TaskForm';
import TaskResults from './TaskResults';

export const Task = () => {
	const [submit, setSubmit] = React.useState(false);
	const [results, setResults] = React.useState();

	const item = useSelector(getTask);
	const { request } = useAuthFetch();

	const history = useHistory();

	React.useEffect(() => {
		if (Object.keys(item).length === 0) {
			history.push('/home');
		}
	});

	const deleteBtnHandler = () => {
		request('/api/school/delsubmit', 'DELETE', {
			assignmentID: item._id,
		});
	};

	const getResultsBtnHandler = () => {
		request(
			'/api/school/getsubmit',
			'POST',
			{
				assignmentID: item._id,
			},
			{},
			(results) => {
				setResults(results.submit);
			}
		);
	};
	console.log('Task rendered');
	return (
		<main className='main'>
			<div className='container'>
				{Object.keys(item).length !== 0 ? (
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
						</div>
						<span className='task__min-title'>Время</span>
						<div className='task__times'>
							<div className='task__time'>Начало задания: {item.date}</div>
							<div className='task__time'>Конец задания: {item.endDate}</div>
						</div>
						<span className='task__min-title'>Вопросы</span>
						{!submit && <TaskForm item={item} setSubmit={setSubmit} />}
						{submit && results && <TaskResults results={results} />}
						{submit && (
							<>
								<div className='task__btns'>
									<button
										className='btn'
										type='button'
										onClick={deleteBtnHandler}>
										Удалить ответы
									</button>
									<button
										className='btn'
										type='button'
										onClick={getResultsBtnHandler}>
										Получить результаты
									</button>
								</div>
							</>
						)}
					</div>
				) : (
					<div>Вы не выбрали задание</div>
				)}
			</div>
		</main>
	);
};
