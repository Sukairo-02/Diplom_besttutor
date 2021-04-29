import React from 'react';
import { Star, People } from '../icons';

import img from '../assets/img/people/1.jpeg';

const TeacherBig = () => {
	return (
		<div className='teacher-big'>
			<img src={img} alt='Аватар' className='teacher-big__avatar' />
			<div className='teacher-big__container'>
				<h3 className='teacher-big__name'>Денис Кудряшев</h3>
				<div className='teacher-big__subject'>Японский</div>
				<span className='teacher-big__disciple'>
					<People size={16} />
					18 учеников
				</span>
				<span className='teacher-big__count'>135 уроков</span>
				<div className='teacher-big__desc'>
					Репетитор по японскому языку. Опыт преподавания японского языка - 10
					лет. Занимаюсь языком 20 лет. Учился в Японии 1 год. Свободно владею
					японским языком. Работаю переводчиком и преподавателем, каждый день
					использую язык.
				</div>
			</div>
			<div className='teacher-big__container teacher-big__container--flex'>
				<span className='teacher-big__rating'>
					<Star size={16} />
					5.0
				</span>
				<span className='teacher-big__review'>183 отзыва</span>
				<div className='teacher-big__price'>800 грн/час</div>
				<button className='btn teacher-big__btn' type='button'>
					Пробный урок
				</button>
				<button className='btn btn--transparent teacher-big__btn' type='button'>
					Профиль
				</button>
			</div>
		</div>
	);
};

export default TeacherBig;
