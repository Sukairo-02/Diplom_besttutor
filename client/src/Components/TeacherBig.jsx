import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	setTeacher,
	fetchTeacherCourses,
	fetchTeacherReviews,
} from '../redux/reducers/teachersSlice';
import { declOfNum, countRating } from '../util';
import { Star } from '../assets/icons';

const TeacherBig = React.memo(({ data }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const profileBtnHandler = async () => {
		await dispatch(setTeacher(data._id));
		await dispatch(fetchTeacherCourses(data._id));
		await dispatch(fetchTeacherReviews());

		history.push(`teacher/${data._id}`);
	};

	return (
		<div className='teacher-big'>
			<img src={data.avatar} alt='Аватар' className='teacher-big__avatar' />
			<div className='teacher-big__container'>
				<h3 className='teacher-big__name'>{data.username}</h3>
				<div className='teacher-big__subject'>{data.subject}</div>
				<span className='teacher-big__count'>
					{data.teacherCourses.length}{' '}
					{declOfNum(data.teacherCourses.length, ['курс', 'курса', 'курсов'])}
				</span>
				<div className='teacher-big__desc'>{data.desc}</div>
			</div>
			<div className='teacher-big__container teacher-big__container--flex'>
				<span className='teacher-big__rating'>
					<Star size={16} /> {countRating(data.reviews)}
				</span>
				<span className='teacher-big__review'>
					{data.reviews.length}{' '}
					{declOfNum(data.reviews.length, ['отзыв', 'отзыва', 'отзывов'])}
				</span>
				<button
					onClick={profileBtnHandler}
					className='btn btn--transparent teacher-big__btn'
					type='button'>
					Профиль
				</button>
			</div>
		</div>
	);
});

export default TeacherBig;
