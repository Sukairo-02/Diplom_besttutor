import React from 'react';
import { useSelector } from 'react-redux';
import { Schedule } from '../Components';
import { Star, People } from '../icons';

import img from '../assets/img/people/1.jpeg';

const Teacher = () => {
	const teacher = useSelector((state) => state.teacher.info);

	return (
		<main className='main'>
			<div className='container'>
				{Object.keys(teacher).length !== 0 ? (
					<div className='teacher-full'>
						<img
							src={teacher.avatar}
							alt='Аватар'
							className='teacher-full__avatar'
						/>
						<div className='teacher-full__container'>
							<h3 className='teacher-full__name'>{teacher.username}</h3>
							<div className='teacher-full__discipline'>{teacher.subject}</div>
							<span className='teacher-full__disciple'>
								<People size={16} />
								18 учеников
							</span>
							<span className='teacher-full__count'>135 уроков</span>
							<span className='teacher-full__rating'>
								<Star size={16} />
								5.0
							</span>
							<p className='teacher-full__desc'>{teacher.desc}</p>
							<span className='teacher-full__title'>Резюме</span>
							<div className='teacher-full__summary'>
								<div className='teacher-full__work'>
									<div className='teacher-full__mini-title'>Работа</div>
									{teacher.experience}
								</div>
								<div className='teacher-full_education'>
									<div className='teacher-full__mini-title'>Образование</div>
									{teacher.education}
								</div>
							</div>
							<span className='teacher-full__title'>Типы курсов</span>
							<div className='teacher-full__subjects'>
								<div className='teacher-full__subject'>
									<div className='teacher-full__container'>
										<div className='teacher-full__mini-title'>
											Японский для начинающих
										</div>
										<div className='teacher-full__lessons'>15 занятий</div>
									</div>
									<button className='btn'>800 грн</button>
								</div>
							</div>
							<span className='teacher-full__title'>Расписание</span>
							<Schedule />
							<span className='teacher-full__title' style={{ marginTop: 20 }}>
								Отзывы
							</span>
							<span className='teacher-full__reviews-count'>183 отзыва</span>
							<div className='teacher-full__reviews'>
								<div className='teacher-full__review'>
									<img
										src={img}
										alt='Аватар'
										className='teacher-full__avatar teacher-full__avatar--min'
									/>
									<div className='teacher-full__container'>
										<h3 className='teacher-full__name'>Фредерик Боунс</h3>
										<div className='teacher-full__date'>2021-02-19</div>
										<p className='teacher-full__desc teacher-full__desc--nonemb'>
											Я очень рекомендую Дениса как вашего учителя японского
											языка. Терпеливый, точный и ясный в его объяснениях,
											учиться с ним приятно и полезно. Не сомневайтесь в выборе
											его в качестве наставника, если хотите добиться быстрого
											прогресса.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					'Loading'
				)}
			</div>
		</main>
	);
};

export default Teacher;
