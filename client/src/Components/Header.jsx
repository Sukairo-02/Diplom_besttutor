import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../redux/selectors';
import { createAuthProvider } from '../jwt';

const Header = () => {
	const info = useSelector(getUserInfo);
	const { logout } = createAuthProvider();
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
			<div className='header__logo'>BestTutor</div>
			<nav className='header__nav'>
				<ul className='header__ul'>
					<li className='header__li'>
						<Link to='/'>Главная</Link>
					</li>
					<li className='header__li'>
						<Link to='/teachers'>Учителя</Link>
					</li>
				</ul>
				<button ref={menuRef} onClick={toggleVisiblePopup} className='btn'>
					Меню
				</button>
				{visibleMenu && (
					<div className='header__menu'>
						<ul>
							{info.roles[0] === 'TCHR' ? (
								<li>
									<Link to='/tasks'>Тесты</Link>
								</li>
							) : (
								''
							)}
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
