import React from 'react';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/selectors';
import EditForm from './EditForm';
import TeacherForm from './TeacherForm';

export const EditProfile = () => {
	const info = useSelector(getUserInfo);

	return (
		<main className='main'>
			<div className='container'>
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
			</div>
		</main>
	);
};
