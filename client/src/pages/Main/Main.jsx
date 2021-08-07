import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { People, Star } from '../../assets/icons';

const colors = [
	'rgba(0, 255, 8, .5)',
	'rgba(255, 213, 0, .5)',
	'rgba(0, 255, 247, .5)',
	'rgba(255, 0, 0, .5)',
	'rgba(119, 0, 255, .5)',
	'rgba(255, 0, 196, .5)',
	'rgba(153, 255, 0, .5)',
	'rgba(246, 255, 0, .5)',
	'rgba(255, 146, 0, .5)',
	'rgba(145, 145, 145, .5)',
	'rgba(0, 0, 255, .5)',
	'rgba(255, 0, 70, .5)',
];

export const Main = () => {
	const history = useHistory();
	const subjectsGridRef = React.useRef();

	React.useEffect(() => {
		subjectsGridRef.current.childNodes.forEach((item, index) => {
			if (item.childNodes[0].className === 'lp-subjects__circle') {
				item.childNodes[0].style.backgroundColor = colors[index - 1];
			}
		});
	}, []);

	const logBtnHandler = () => {
		history.push('login');
	};

	const regBtnHandler = () => {
		history.push('signup');
	};

	return (
		<div className='lp'>
			<div className='lp-intro'>
				<div className='lp-intro__skewed'></div>

				<div className='lp-container'>
					<div className='lp-row'>
						<header className='lp-header'>
							<div className='lp-header__group'>
								<div className='lp-header__logo'>BestTutor</div>
								<nav className='lp-header__nav'>
									<ul>
										<li>
											<a href='#subjects'>Предметы</a>
										</li>
										<li>
											<a href='#teachers'>Учителя</a>
										</li>
										<li>
											<a href='#citys'>Города</a>
										</li>
										<li>
											<a href='#offers'>Стать учителем</a>
										</li>
									</ul>
								</nav>
							</div>
							<div className='lp-header__enter'>
								<Link to='/login'>Войти</Link> / <Link to='/signup'>Зарегистрироваться</Link>
							</div>
						</header>
					</div>
				</div>

				<section className='lp-about'>
					<div className='lp-container'>
						<div className='lp-about__row'>
							<div className='lp-about__group'>
								<h1 className='lp-about__title'>Найди лучшего учителя для своего ребёнка</h1>
								<p className='lp-about__text'>
									Получай квалифицированную помощь <br /> онлайн или на дому
								</p>
								<button onClick={logBtnHandler} className='btn'>
									Найти учителя
								</button>
							</div>
							<div>
								<img className='lp-about__img' src='img/main.webp' alt='Онлайн обучение' />
							</div>
						</div>
					</div>
				</section>
			</div>

			<section className='lp-steps'>
				<div className='lp-container'>
					<div className='lp-steps__row'>
						<div className='lp-steps__group'>
							<h3 className='lp-steps__title'>Найди учителя</h3>
							<p className='lp-steps__text'>
								Найди подходящего учителя <br /> для себя благодаря удобному поиску.
							</p>
						</div>
						<div className='lp-steps__group'>
							<h3 className='lp-steps__title'>Выбери время</h3>
							<p className='lp-steps__text'>
								Выбери подходящие время
								<br /> для занятий и согласуй его с учителем.
							</p>
						</div>
						<div className='lp-steps__group'>
							<h3 className='lp-steps__title'>Начни учиться</h3>
							<p className='lp-steps__text'>
								Проведи пробный урок и начни <br /> заниматься на постоянной основе.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id='subjects' className='lp-subjects'>
				<div className='lp-container'>
					<div className='lp-row'>
						<div ref={subjectsGridRef} className='lp-subjects__grid'>
							<div className='lp-subjects__info'>
								<h3 className='lp-subjects__title'>Выбери предмет для себя</h3>
								<p className='lp-subjects__text'>
									Больше 10к учеников занимается у нас с лучшими учителями в своем деле. От Математики до Английского,
									от Истории до Биологии, от Программирования до Пения, у нас есть все. Найди своего учителя.
								</p>
								<button onClick={logBtnHandler} className='btn'>
									Найти учителя
								</button>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Музыка</div>
								<div className='lp-subjects__teacher'>35 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Математика</div>
								<div className='lp-subjects__teacher'>15 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Рисование</div>
								<div className='lp-subjects__teacher'>6 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Японский</div>
								<div className='lp-subjects__teacher'>18 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>История</div>
								<div className='lp-subjects__teacher'>15 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Русский</div>
								<div className='lp-subjects__teacher'>26 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Биология</div>
								<div className='lp-subjects__teacher'>52 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>География</div>
								<div className='lp-subjects__teacher'>12 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Химия</div>
								<div className='lp-subjects__teacher'>30 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Геометрия</div>
								<div className='lp-subjects__teacher'>10 учителей</div>
							</div>
							<div className='lp-subjects__item'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Литература</div>
								<div className='lp-subjects__teacher'>32 учителей</div>
							</div>
							<div className='lp-subjects__item lp-subjects__item_last'>
								<div className='lp-subjects__circle'></div>
								<div className='lp-subjects__name'>Пение</div>
								<div className='lp-subjects__teacher'>15 учителей</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id='teachers' className='lp-teachers'>
				<div className='lp-container'>
					<div className='lp-row'>
						<div className='col-12'>
							<h3 className='lp-teachers__title'>Наши учителя</h3>
						</div>

						<div className='col-xl-12'>
							<div className='lp-teachers__container'>
								<div className='lp-teachers__item'>
									<div className='lp-teachers__group'>
										<div className='lp-teachers__img'>
											<img src='img/teachers/1.webp' alt='Светлана Шевцова' />
										</div>
										<div className='lp-teachers__info'>
											<h5 className='lp-teachers__name'>Светлана Шевцова</h5>
											<p className='lp-teachers__city'>Днепр</p>
										</div>
									</div>
									<div className='lp-teachers__desc'>
										Репетитор по Норвежскому языку. Опыт преподавания Норвежского языка - 8 лет. Занимаюсь языком 10
										лет. Училась в Норвегии 3 год. Свободно владею Норвежским языком. Работаю в Норвежской фирме, каждый
										день использую язык
									</div>
									<div className='lp-teacher__subject'>Норвежский</div>
									<div className='lp-teachers__group' style={{ flexWrap: 'wrap' }}>
										<div className='lp-teacher__students'>
											<People size={16} /> 15 учеников
										</div>
										<div className='lp-teacher__subjects'>3 курса</div>
										<div className='lp-teacher__points'>
											<Star size={16} />9
										</div>
										<div className='lp-teacher__reviews'>20 отзывов</div>
									</div>
								</div>
								<div className='lp-teachers__item'>
									<div className='lp-teachers__group'>
										<div className='lp-teachers__img'>
											<img src='img/teachers/2.webp' alt='Светлана Шевцова' />
										</div>
										<div className='lp-teachers__info'>
											<h5 className='lp-teachers__name'>Евгений Голота</h5>
											<p className='lp-teachers__city'>Киев</p>
										</div>
									</div>
									<div className='lp-teachers__desc'>
										Репетитор по Норвежскому языку. Опыт преподавания Норвежского языка - 8 лет. Занимаюсь языком 10
										лет. Училась в Норвегии 3 год. Свободно владею Норвежским языком. Работаю в Норвежской фирме, каждый
										день использую язык
									</div>
									<div className='lp-teacher__subject'>Арабский</div>
									<div className='lp-teachers__group' style={{ flexWrap: 'wrap' }}>
										<div className='lp-teacher__students'>
											<People size={16} /> 56 учеников
										</div>
										<div className='lp-teacher__subjects'>10 курсов</div>
										<div className='lp-teacher__points'>
											<Star size={16} />
											9.5
										</div>
										<div className='lp-teacher__reviews'>103 отзыва</div>
									</div>
								</div>
								<div className='lp-teachers__item'>
									<div className='lp-teachers__group'>
										<div className='lp-teachers__img'>
											<img src='img/teachers/3.webp' alt='Светлана Шевцова' />
										</div>
										<div className='lp-teachers__info'>
											<h5 className='lp-teachers__name'>Михаил Мельник</h5>
											<p className='lp-teachers__city'>Одесса</p>
										</div>
									</div>
									<div className='lp-teachers__desc'>
										Репетитор по Норвежскому языку. Опыт преподавания Норвежского языка - 8 лет. Занимаюсь языком 10
										лет. Училась в Норвегии 3 год. Свободно владею Норвежским языком. Работаю в Норвежской фирме, каждый
										день использую язык
									</div>
									<div className='lp-teacher__subject'>Немецкий</div>
									<div className='lp-teachers__group' style={{ flexWrap: 'wrap' }}>
										<div className='lp-teacher__students'>
											<People size={16} /> 39 ученика
										</div>
										<div className='lp-teacher__subjects'>8 курсов</div>
										<div className='lp-teacher__points'>
											<Star size={16} />
											7.8
										</div>
										<div className='lp-teacher__reviews'>29 отзывов</div>
									</div>
								</div>
								<div className='lp-teachers__item'>
									<div className='lp-teachers__group'>
										<div className='lp-teachers__img'>
											<img src='img/teachers/4.webp' alt='Светлана Шевцова' />
										</div>
										<div className='lp-teachers__info'>
											<h5 className='lp-teachers__name'>Валерия Коваленко</h5>
											<p className='lp-teachers__city'>Харьков</p>
										</div>
									</div>
									<div className='lp-teachers__desc'>
										Репетитор по Норвежскому языку. Опыт преподавания Норвежского языка - 8 лет. Занимаюсь языком 10
										лет. Училась в Норвегии 3 год. Свободно владею Норвежским языком. Работаю в Норвежской фирме, каждый
										день использую язык
									</div>
									<div className='lp-teacher__subject'>Украинский</div>
									<div className='lp-teachers__group' style={{ flexWrap: 'wrap' }}>
										<div className='lp-teacher__students'>
											<People size={16} /> 3 ученика
										</div>
										<div className='lp-teacher__subjects'>2 курса</div>
										<div className='lp-teacher__points'>
											<Star size={16} />8
										</div>
										<div className='lp-teacher__reviews'>10 отзывов</div>
									</div>
								</div>
								<div className='lp-teachers__item'>
									<div className='lp-teachers__group'>
										<div className='lp-teachers__img'>
											<img src='img/teachers/5.webp' alt='Светлана Шевцова' />
										</div>
										<div className='lp-teachers__info'>
											<h5 className='lp-teachers__name'>Дмитрий Лозенко</h5>
											<p className='lp-teachers__city'>Донецк</p>
										</div>
									</div>
									<div className='lp-teachers__desc'>
										Репетитор по Норвежскому языку. Опыт преподавания Норвежского языка - 8 лет. Занимаюсь языком 10
										лет. Училась в Норвегии 3 год. Свободно владею Норвежским языком. Работаю в Норвежской фирме, каждый
										день использую язык
									</div>
									<div className='lp-teacher__subject'>Корейский</div>
									<div className='lp-teachers__group' style={{ flexWrap: 'wrap' }}>
										<div className='lp-teacher__students'>
											<People size={16} /> 189 ученика
										</div>
										<div className='lp-teacher__subjects'>27 курсов</div>
										<div className='lp-teacher__points'>
											<Star size={16} />
											10
										</div>
										<div className='lp-teacher__reviews'>198 отзывов</div>
									</div>
								</div>
								<div className='lp-teachers__item'>
									<div className='lp-teachers__group'>
										<div className='lp-teachers__img'>
											<img src='img/teachers/6.webp' alt='Светлана Шевцова' />
										</div>
										<div className='lp-teachers__info'>
											<h5 className='lp-teachers__name'>Наталья Ермакова</h5>
											<p className='lp-teachers__city'>Днепр</p>
										</div>
									</div>
									<div className='lp-teachers__desc'>
										Репетитор по Норвежскому языку. Опыт преподавания Норвежского языка - 8 лет. Занимаюсь языком 10
										лет. Училась в Норвегии 3 год. Свободно владею Норвежским языком. Работаю в Норвежской фирме, каждый
										день использую язык
									</div>
									<div className='lp-teacher__subject'>Испанский</div>
									<div className='lp-teachers__group' style={{ flexWrap: 'wrap' }}>
										<div className='lp-teacher__students'>
											<People size={16} /> 84 ученика
										</div>
										<div className='lp-teacher__subjects'>13 курсов</div>
										<div className='lp-teacher__points'>
											<Star size={16} />
											7.8
										</div>
										<div className='lp-teacher__reviews'>57 отзывов</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id='citys' className='lp-citys'>
				<div className='lp-container'>
					<div className='lp-row'>
						<div className='lp-citys__grid'>
							<div className='lp-citys__info'>
								<h3 className='lp-citys__title'>Найди учителя в своем городе</h3>
								<p className='lp-citys__text'>
									Выбери город и начни поиск учителя рядом с собой. Запишись к учителю который тебе подошел больше всего
									и проводи частные уроки на дому.
								</p>
								<button onClick={logBtnHandler} className='btn'>
									Найти учителя
								</button>
							</div>
							<div className='lp-citys__item'>
								<img className='lp-citys__img' src='img/citys/1.webp' alt='Львов' />

								<h5 className='lp-citys__name'>Львов</h5>
								<p className='lp-citys__count'>126 учителей</p>
							</div>
							<div className='lp-citys__item'>
								<img className='lp-citys__img' src='img/citys/2.webp' alt='Киев' />

								<h5 className='lp-citys__name'>Киев</h5>
								<p className='lp-citys__count'>230 учителей</p>
							</div>
							<div className='lp-citys__item'>
								<img className='lp-citys__img' src='img/citys/3.webp' alt='Харьков' />

								<h5 className='lp-citys__name'>Харьков</h5>
								<p className='lp-citys__count'>185 учителей</p>
							</div>
							<div className='lp-citys__item'>
								<img className='lp-citys__img' src='img/citys/4.webp' alt='Донецк' />

								<h5 className='lp-citys__name'>Донецк</h5>
								<p className='lp-citys__count'>290 учителей</p>
							</div>
							<div className='lp-citys__item'>
								<img className='lp-citys__img' src='img/citys/5.webp' alt='Днепр' />

								<h5 className='lp-citys__name'>Днепр</h5>
								<p className='lp-citys__count'>110 учителей</p>
							</div>
							<div className='lp-citys__item'>
								<img className='lp-citys__img' src='img/citys/6.webp' alt='Одесса' />

								<h5 className='lp-citys__name'>Одесса</h5>
								<p className='lp-citys__count'>298 учителей</p>
							</div>
							<div className='lp-citys__item lp-citys__item_last'>
								<img className='lp-citys__img' src='img/citys/7.webp' alt='Мукачево' />

								<h5 className='lp-citys__name'>Мукачево</h5>
								<p className='lp-citys__count'>546 учителей</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id='offers' className='lp-offers'>
				<div className='lp-container'>
					<div className='lp-row'>
						<h3 className='lp-offers__title'>Присоединяйся к нам сегодня</h3>

						<div className='lp-offers__container'>
							<div className='lp-offers__card'>
								<div className='lp-offers__circle lp-offers__circle_first'></div>
								<div className='lp-offers__name'>Стань учеником</div>
								<ul className='lp-offers__list'>
									<li>Учи любой предмет в любое время</li>
									<li>Учись онлайн или на дому</li>
									<li>Найди лучшего учителя для себя</li>
									<li>Управляй своим расписанием</li>
									<li>Удобная связь с учителем</li>
								</ul>
								<button onClick={regBtnHandler} className='btn lp-offers__btn'>
									Зарегестрироваться
								</button>
							</div>
							<div className='lp-offers__card'>
								<div className='lp-offers__circle lp-offers__circle_second'></div>
								<div className='lp-offers__name'>Стань учителем</div>
								<ul className='lp-offers__list'>
									<li>Личный кабинет</li>
									<li>Детальное управление профилем</li>
									<li>Возможность заниматься с большим количеством учеников</li>
									<li>Быстрая оплата за уроки</li>
								</ul>
								<button onClick={regBtnHandler} className='btn lp-offers__btn'>
									Зарегестрироваться
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className='lp-footer'>
				<div className='lp-container'>
					<div className='lp-row'>
						<header className='lp-header'>
							<div className='lp-header__group'>
								<div className='lp-header__logo'>BestTutor</div>
								<nav className='lp-header__nav'>
									<ul>
										<li>
											<a href='#subjects'>Предметы</a>
										</li>
										<li>
											<a href='#teachers'>Учителя</a>
										</li>
										<li>
											<a href='#citys'>Города</a>
										</li>
										<li>
											<a href='#offers'>Стать учителем</a>
										</li>
									</ul>
								</nav>
							</div>
							<div className='lp-header__enter'>
								<Link to='/login'>Войти</Link> / <Link to='/signup'>Зарегистрироваться</Link>
							</div>
						</header>
					</div>
				</div>
			</footer>
		</div>
	);
};
