import { useSelector } from 'react-redux';

const TeacherProfile = () => {
	const info = useSelector((state) => state.userInfo.info);
	return (
		<>
			{!info.teacherCourses.length ? (
				<div className='content__empty'>
					У вас пока нет предметов и учеников.
					<button className='btn' type='button'>
						Настроить профиль
					</button>
				</div>
			) : (
				<div>Courses</div>
			)}
		</>
	);
};

export default TeacherProfile;
