import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../redux/reducers/userInfoSlice';
import {
	fetchTeacher,
	fetchTeacherReviews,
} from '../../redux/reducers/teachersSlice';
import { getUserInfo, getTeacher } from '../../redux/selectors';
import { useAuthFetch } from '../../hooks/authFetch.hook';
import { Loader } from '../../Components';
import { declOfNum, countRating, countStudents } from '../../util';
import { Star, People } from '../../assets/icons';

export const Teacher = ({ match }) => {
	const { request } = useAuthFetch();
	const dispatch = useDispatch();
	const teacher = useSelector(getTeacher);
	const info = useSelector(getUserInfo);

	React.useEffect(() => {
		const loadTeacherData = async (id) => {
			await dispatch(fetchTeacher(id));
			await dispatch(fetchTeacherReviews());
		};

		if (Object.keys(teacher).length === 0 && match.params.id) {
			loadTeacherData(match.params.id);
		}
	}, [dispatch, match.params.id, teacher]);

	const deleteBtnHandler = () => {
		request('/api/school/delreview', 'DELETE', {
			teacher: teacher._id,
		});
	};

	const subscribeToCourse = (id) => {
		request(`/api/school/subscribe/${id}`, 'POST', {}, () => {
			dispatch(fetchUserInfo());
		});
	};

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
						<div className='teacher-full__container teacher-full__container--flex'>
							<h2 className='teacher-full__name'>{teacher.username}</h2>
							<span className='teacher-full__discipline'>
								{teacher.subject}
							</span>
							<span className='teacher-full__disciple'>
								<People size={16} /> {countStudents(teacher.teacherCourses)}{' '}
								{declOfNum(countStudents(teacher.teacherCourses), [
									'ученик',
									'ученика',
									'учеников',
								])}
							</span>
							<span className='teacher-full__count'>
								{teacher.teacherCourses.length}{' '}
								{declOfNum(teacher.teacherCourses.length, [
									'курс',
									'курса',
									'курсов',
								])}
							</span>
							<span className='teacher-full__rating'>
								<Star size={16} /> {countRating(teacher.reviews)}
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
								{teacher.teacherCourses.length ? (
									teacher.teacherCourses.map((course) => (
										<div className='teacher-full__subject' key={course._id}>
											<div className='teacher-full__container'>
												<div className='teacher-full__mini-title'>
													{course.title}
												</div>
												<div className='teacher-full__lessons'>
													{course.lessons.length}{' '}
													{declOfNum(course.lessons.length, [
														'занятие',
														'занятия',
														'занятий',
													])}
												</div>
											</div>
											<button
												type='button'
												title='Купить курс'
												className='btn'
												onClick={() => subscribeToCourse(course._id)}>
												{course.price} грн
											</button>
										</div>
									))
								) : (
									<div>Курсов нет</div>
								)}
							</div>
							<span className='teacher-full__title'>Отзывы</span>
							<span className='teacher-full__reviews-count'>
								{teacher.reviews.length}{' '}
								{declOfNum(teacher.reviews.length, [
									'отзыв',
									'отзыва',
									'отзывов',
								])}
							</span>
							<div className='teacher-full__reviews'>
								{teacher.reviews.length ? (
									teacher.reviews.map((review) => (
										<div className='teacher-full__review' key={review._id}>
											<img
												src={review.avatar}
												alt='Аватар'
												className='teacher-full__avatar teacher-full__avatar--min'
											/>
											<div className='teacher-full__container'>
												<h3 className='teacher-full__name'>
													{review.username}
												</h3>
												<div className='teacher-full__rating'>
													<Star size={16} /> {review.rating}/10
												</div>
												<p className='teacher-full__desc teacher-full__desc--nonemb'>
													{review.text}
												</p>
											</div>
											{review.author === info._id && (
												<div
													className='teacher-full__review-del'
													title='Удалить отзыв'
													onClick={deleteBtnHandler}>
													&#215;
												</div>
											)}
										</div>
									))
								) : (
									<div>Отзывов нет</div>
								)}
							</div>
						</div>
					</div>
				) : (
					<Loader text='Загрузка данных учителя' />
				)}
			</div>
		</main>
	);
};
