import React from 'react';
import { AuthContext } from '../context/AuthContext';

import img from '../assets/img/people/1.jpeg';

const Header = () => {
	const auth = React.useContext(AuthContext);
	const [visibleMenu, setVisibleMenu] = React.useState(false);

	const menuRef = React.useRef();

	const toggleVisiblePopup = () => {
		setVisibleMenu(!visibleMenu);
	};

	const handleOutsideClick = (event) => {
		if (menuRef.current && !menuRef.current.contains(event.target)) {
			setVisibleMenu(false);
		}
	};

	React.useEffect(() => {
		document.body.addEventListener('click', handleOutsideClick);
	}, []);

	const logoutHandler = () => {
		auth.logout();
	};

	return (
		<header className='header'>
			<div className='header__logo'>Tutor</div>
			<nav className='header__nav'>
				<ul className='header__ul'>
					<li className='header__li'>
						<a href='#'>Предметы</a>
					</li>
					<li className='header__li'>
						<a href='#'>Учителя</a>
					</li>
					<li className='header__li'>
						<a href='#'>Оффлайн уроки</a>
					</li>
				</ul>
				<img
					ref={menuRef}
					src={img}
					alt='Аватар'
					className='header__avatar'
					onClick={toggleVisiblePopup}
				/>
				{visibleMenu && (
					<div className='header__menu'>
						<ul>
							<li>
								<a href='#'>Чаты</a>
							</li>
							<li>
								<a href='#'>Предметы</a>
							</li>
							<li>
								<a href='#'>Редактировать профиль</a>
							</li>
							<li>
								<a href='/login' onClick={logoutHandler}>
									Выход
								</a>
							</li>
						</ul>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;
