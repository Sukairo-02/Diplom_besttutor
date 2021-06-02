import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchTeachers,
	sortItems,
	setFilter,
} from '../redux/reducers/teachersSlice';
import { fetchSubjects } from '../redux/reducers/subjectsSlice';
import {
	setTeacher,
	fetchTeacherCourses,
	fetchTeacherReviews,
} from '../redux/reducers/teachersSlice';
import { getSubjects } from '../redux/selectors';
import { TeacherBig } from '../Components';

const parametersItems = [
	{ name: 'Оценка: высокая', value: 'pointsAsc' },
	{ name: 'Оценка: низкая', value: 'pointsDesc' },
	{ name: 'Количество отзывов', value: 'reviews' },
	{ name: 'Количество курсов', value: 'corses' },
];

const Teachers = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const teachers = useSelector((state) => {
		const filter = state.teachers.filter;
		const all = state.teachers.items;

		if (filter !== '') {
			const filteredArr = all.filter((item) => item.subject === filter);
			return filteredArr.length ? filteredArr : all;
		}

		return all;
	});
	const subjects = useSelector(getSubjects);

	React.useEffect(() => {
		async function loadData() {
			await dispatch(fetchTeachers());
			await dispatch(fetchSubjects());
		}

		if (!teachers.length) {
			loadData();
		}
	});

	const parametersHandler = (type) => {
		dispatch(sortItems(type));
	};

	const filteringHandler = (name) => {
		dispatch(setFilter(name));
	};

	const profileBtnHandler = React.useCallback(
		async (id) => {
			await dispatch(setTeacher(id));
			await dispatch(fetchTeacherCourses(id));
			await dispatch(fetchTeacherReviews());

			history.push(`teacher/${id}`);
		},
		[dispatch, history]
	);

	return (
		<main className='main'>
			<div className='container'>
				<div className='content'>
					<div className='content__main'>
						<div className='teachers'>
							{teachers.length ? (
								teachers.map((teacher) => (
									<div className='teachers__item' key={teacher._id}>
										<TeacherBig
											data={teacher}
											profileBtnHandler={profileBtnHandler}
										/>
									</div>
								))
							) : (
								<span>Загрузка учителей</span>
							)}
						</div>
					</div>
					<div className='content__aside'>
						<div className='teachers__filtration'>
							<h3 className='form__title'>Фильтрация</h3>
							<form className='form'>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='filterSubjects'>
										Предмет
									</label>
									<select
										className='form__select'
										name='filtering'
										id='filterSubjects'
										onChange={(event) => filteringHandler(event.target.value)}>
										<option value=''>Все</option>
										{subjects.length &&
											subjects.map((subject) => (
												<option key={subject._id} value={subject.name}>
													{subject.name}
												</option>
											))}
									</select>
								</fieldset>
								<fieldset className='form__fieldset'>
									<label className='form__label' htmlFor='filterParameters'>
										Параметры
									</label>
									<select
										className='form__select'
										name='parameters'
										id='filterParameters'
										onChange={(event) => parametersHandler(event.target.value)}>
										<option value=''>Выбирите параметр</option>
										{parametersItems.map((item) => (
											<option key={item.value} value={item.value}>
												{item.name}
											</option>
										))}
									</select>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Teachers;
