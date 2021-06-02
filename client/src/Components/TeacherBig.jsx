import React from 'react';
import { declOfNum, countRating } from '../util';
import { Star } from '../assets/icons';

const TeacherBig = React.memo(({ data, profileBtnHandler }) => {
	return (
		<div className='teacher-big'>
			<img src={data.avatar} alt='Аватар' className='teacher-big__avatar' />
			<div className='teacher-big__container'>
				<h4 className='teacher-big__name'>{data.username}</h4>
				<span className='teacher-big__subject'>{data.subject}</span>
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
					onClick={() => profileBtnHandler(data._id)}
					className='btn btn--transparent teacher-big__btn'
					type='button'>
					Профиль
				</button>
			</div>
		</div>
	);
});

export default TeacherBig;
