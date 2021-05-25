import React from 'react';
import { useSelector } from 'react-redux';
import { TeacherProfile, UserProfile } from '../Components';

const Home = () => {
	const info = useSelector((state) => state.userInfo.info);

	return (
		<main className='main'>
			<div className='container'>
				{Object.keys(info).length !== 0 ? (
					<>
						{info.roles[0] === 'TCHR' ? (
							<TeacherProfile info={info} />
						) : (
							<UserProfile info={info} />
						)}
					</>
				) : (
					<span>Загрузка профиля</span>
				)}
			</div>
		</main>
	);
};

export default Home;
