import React from 'react';
import { useSelector } from 'react-redux';
import { getTask } from '../redux/selectors';
import { createAuthProvider } from '../jwt';
import { TaskForm, TaskResults } from '../Components';

const Task = () => {
	const [state, setState] = React.useState('');
	const [submit, setSubmit] = React.useState(false);
	const [results, setResults] = React.useState();

	const item = useSelector(getTask);
	const { authFetch } = createAuthProvider();

	const deleteBtnHandler = async () => {
		setState('Loading');
		try {
			const result = await authFetch('/api/school/delsubmit', 'DELETE', {
				assignmentID: item._id,
			});
			setState(result.message);
		} catch (err) {
			setState(err.message);
		}
	};

	const getResultsBtnHandler = async () => {
		try {
			const result = await authFetch('/api/school/getsubmit', 'POST', {
				assignmentID: item._id,
			});
			setResults(result.submit);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<main className='main'>
			<div className='container'>
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
						<div className='task__time'>Начало теста: {item.date}</div>
						<div className='task__time'>Конец теста: {item.endDate}</div>
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
							<div>{state}</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
};

export default Task;
