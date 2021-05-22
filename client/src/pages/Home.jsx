import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../redux/reducers/userInfoSlice';
import { TeacherProfile, UserProfile } from '../Components';

const Home = () => {
	const dispatch = useDispatch();
	const info = useSelector((state) => state.userInfo.info);

	React.useEffect(() => {
		if (Object.keys(info).length === 0) {
			dispatch(fetchUserInfo());
		}
	});

	return (
		<main className='main'>
			<div className='container'>
				{Object.keys(info).length !== 0 ? (
					<>{info.roles[0] === 'TCHR' ? <TeacherProfile /> : <UserProfile />}</>
				) : (
					<span>Загрузка профиля</span>
				)}
			</div>
		</main>
	);
};

export default Home;
