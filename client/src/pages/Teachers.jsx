import React from 'react';
import { createAuthProvider } from '../jwt';
import { Schedule, TeacherBig } from '../Components';

const Teachers = () => {
	const { authFetch } = createAuthProvider();

	React.useEffect(async () => {
		let response = await authFetch('/api/auth//userlist/TCHR', {
			method: 'GET',
		});
		let result = await response.json();
		console.log(result);
	}, []);

	return (
		<main className='main'>
			<div className='container'>
				<div className='teachers'>
					<div className='teachers__item'>
						<TeacherBig />
						<div className='teacher-big__dop'>
							<span>Расписание</span>
							<Schedule />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Teachers;
