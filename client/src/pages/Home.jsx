import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../redux/reducers/userInfoSlice';
import { TeacherProfile, UserProfile } from '../Components';

const Home = () => {
	const dispatch = useDispatch();
	const info = useSelector((state) => state.userInfo.info);

	React.useEffect(() => {
		async function getUserInfo() {
			await dispatch(fetchUserInfo());
		}

		if (Object.keys(info).length === 0) {
			getUserInfo();
		}
	});

	return (
		<main className='main'>
			<div className='container'>
				<div className='content'>
					<div className='content__main'>
						{Object.keys(info).length !== 0 && (
							<>
								{info.roles[0] === 'TCHR' ? (
									<TeacherProfile />
								) : (
									<UserProfile />
								)}
							</>
						)}
					</div>
					<div className='content__aside'></div>
				</div>
			</div>
		</main>
	);
};

export default Home;
