import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjects } from '../redux/reducers/subjectsSlice';

const colors = [
	'rgba(229, 143, 143, 0.5)',
	'rgba(91, 255, 196, 0.5)',
	'rgba(129, 126, 255, 0.5)',
	'rgba(219, 219, 219, 0.5)',
	'rgba(227, 143, 229, 0.5)',
	'rgba(237, 107, 185, 0.5)',
	'rgba(255, 245, 0, 0.5)',
	'rgba(143, 223, 229, 0.5)',
	'rgba(255, 184, 144, 0.5)',
	'rgba(255, 0, 229, 0.5)',
	'rgba(112, 255, 0, 0.5)',
	'rgba(0, 240, 255, 0.5)',
	'rgba(0, 71, 255, 0.5)',
	'rgba(255, 184, 0, 0.5)',
];

const Subjects = () => {
	const dispatch = useDispatch();
	const subjects = useSelector((state) => state.subjects.items);

	React.useEffect(() => {
		if (!subjects.length) {
			dispatch(fetchSubjects());
		}
	});

	return (
		<main className='main'>
			<div className='container'>
				<div className='subjects-list'>
					{subjects &&
						subjects.map((subject) => (
							<div
								style={{
									backgroundColor:
										colors[Math.floor(Math.random() * colors.length)],
								}}
								key={subject._id}
								className='subjects-list__item'>
								{subject.name}
							</div>
						))}
				</div>
			</div>
		</main>
	);
};

export default Subjects;
