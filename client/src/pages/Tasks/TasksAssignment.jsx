import React from 'react';
import PropTypes from 'prop-types';
import { selectAssignmentById } from '../../redux/reducers/userInfoSlice';
import { useSelector } from 'react-redux';

const TasksAssignment = ({ assignmentID, courseID, openTaskHandeler }) => {
	const assignment = useSelector((state) =>
		selectAssignmentById(state, assignmentID)
	);

	const openTask = () => {
		openTaskHandeler(assignmentID, courseID);
	};

	return (
		<div className='subject__task'>
			<div className='subject__task-name'>{assignment.title}</div>
			<button className='btn' type='button' onClick={openTask}>
				Открыть
			</button>
		</div>
	);
};

TasksAssignment.propTypes = {
	assignmentID: PropTypes.string,
	courseID: PropTypes.string,
	openTaskHandeler: PropTypes.func,
};

export default TasksAssignment;
