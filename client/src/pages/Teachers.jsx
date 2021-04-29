import React from 'react';
import { Schedule, TeacherBig } from '../Components';

const Teachers = () => {
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
