import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../redux/reducers/userInfoSlice';
import { EditForm, TeacherForm } from '../Components';

const EditProfile = () => {
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
				{Object.keys(info).length !== 0 && (
					<div className='content'>
						<div className='content__main'>
							<div className='edit-form edit-form--big'>
								<EditForm data={info} />
							</div>
						</div>
						<aside className='content__aside'>
							{info.roles[0] === 'TCHR' && (
								<div className='edit-form edit-form--little'>
									<TeacherForm data={info} />
								</div>
							)}
						</aside>
					</div>
				)}
			</div>
		</main>
	);
};

export default EditProfile;
