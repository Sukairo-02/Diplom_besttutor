import React from 'react';
import { Link } from 'react-router-dom';
import { createAuthProvider } from '../jwt';
import { useSelector } from 'react-redux';

const Header = () => {
	const { logout } = createAuthProvider();
	const info = useSelector((state) => state.userInfo.info);
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
		logout();
	};

	return (
		<header className='header'>
			<div className='header__logo'>Tutor</div>
			<nav className='header__nav'>
				<ul className='header__ul'>
					<li className='header__li'>
						<Link to='/'>Главная</Link>
					</li>
					<li className='header__li'>
						<Link to='/subjects'>Предметы</Link>
					</li>
					<li className='header__li'>
						<Link to='/teachers'>Учителя</Link>
					</li>
					<li className='header__li'>
						<Link to='/offlineLessons'>Оффлайн уроки</Link>
					</li>
				</ul>
				<img
					ref={menuRef}
					src={info.avatar}
					alt='Аватар'
					className='header__avatar'
					onClick={toggleVisiblePopup}
				/>
				{visibleMenu && (
					<div className='header__menu'>
						<ul>
							<li>
								<Link to='/chats'>Чаты</Link>
							</li>
							<li>
								<Link to='/editProfile'>Редактировать профиль</Link>
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
