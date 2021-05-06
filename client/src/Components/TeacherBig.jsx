import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTeacher } from '../redux/reducers/teacherSlice';
import { Star, People } from '../icons';

const TeacherBig = ({ data }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const profileBtnHandler = async () => {
		dispatch(fetchTeacher(data._id));
		history.push(`teacher/${data._id}`);
	};

	return (
		<div className='teacher-big'>
			<img src={data.avatar} alt='Аватар' className='teacher-big__avatar' />
			<div className='teacher-big__container'>
				<h3 className='teacher-big__name'>{data.username}</h3>
				<div className='teacher-big__subject'>{data.subject}</div>
				<span className='teacher-big__disciple'>
					<People size={16} />
					18 учеников
				</span>
				<span className='teacher-big__count'>135 уроков</span>
				<div className='teacher-big__desc'>{data.desc}</div>
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
				<button
					onClick={profileBtnHandler}
					className='btn btn--transparent teacher-big__btn'
					type='button'>
					Профиль
				</button>
			</div>
		</div>
	);
};

export default TeacherBig;
