import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../redux/reducers/teachersSlice';
import { TeacherBig } from '../Components';

const Teachers = () => {
	const dispatch = useDispatch();
	const teachers = useSelector((state) => state.teachers.items);

	React.useEffect(() => {
		if (!teachers.length) {
			dispatch(fetchTeachers());
		}
	});

	return (
		<main className='main'>
			<div className='container'>
				<div className='teachers'>
					{teachers &&
						teachers.map((teacher) => (
							<div className='teachers__item' key={teacher._id}>
								<TeacherBig data={teacher} />
							</div>
						))}
				</div>
			</div>
		</main>
	);
};

export default Teachers;
