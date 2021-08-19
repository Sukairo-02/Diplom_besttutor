import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchTeachers,
	sortItems,
	setFilter,
} from '../../redux/reducers/teachersSlice';
import { fetchSubjects } from '../../redux/reducers/subjectsSlice';
import {
	setTeacher,
	fetchTeacherCourses,
	fetchTeacherReviews,
} from '../../redux/reducers/teachersSlice';
import { getSubjects } from '../../redux/selectors';
import TeacherBig from './TeacherBig';
import TeachersFiltration from './TeachersFiltration';
import { Loader } from '../../Components';

const parametersItems = [
	{ name: 'Оценка: высокая', value: 'pointsAsc' },
	{ name: 'Оценка: низкая', value: 'pointsDesc' },
	{ name: 'Количество отзывов', value: 'reviews' },
	{ name: 'Количество курсов', value: 'corses' },
];

export const Teachers = () => {
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
		if (!teachers.length) {
			dispatch(fetchTeachers());
		}

		if (!subjects.length) {
			dispatch(fetchSubjects());
		}
	}, [dispatch]);

	const parametersHandler = React.useCallback(
		(type) => {
			dispatch(sortItems(type));
		},
		[dispatch]
	);

	const filteringHandler = React.useCallback(
		(name) => {
			dispatch(setFilter(name));
		},
		[dispatch]
	);

	const profileBtnHandler = React.useCallback(
		async (id) => {
			await dispatch(setTeacher(id));
			await dispatch(fetchTeacherCourses(id));
			await dispatch(fetchTeacherReviews());

			history.push(`teacher/${id}`, { id });
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
								<Loader text={'Загрузка учителей'} />
							)}
						</div>
					</div>
					<div className='content__aside'>
						<TeachersFiltration
							subjects={subjects}
							filteringHandler={filteringHandler}
							parametersItems={parametersItems}
							parametersHandler={parametersHandler}
						/>
					</div>
				</div>
			</div>
		</main>
	);
};
