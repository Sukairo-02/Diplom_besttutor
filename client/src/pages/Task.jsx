import React from 'react';
import { useSelector } from 'react-redux';
import { createAuthProvider } from '../jwt';
import { TaskForm, TaskResults } from '../Components';

const Task = () => {
	const [state, setState] = React.useState('');
	const [submit, setSubmit] = React.useState(false);
	const [results, setResults] = React.useState();

	const { item } = useSelector(({ task }) => task);
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
					{!submit && <TaskForm item={item} setSubmit={setSubmit} />}
					{submit && results && <TaskResults results={results} />}
					{submit && (
						<>
							<div className='previewTask__btns'>
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
