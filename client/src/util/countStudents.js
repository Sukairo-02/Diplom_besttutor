const countStudents = (arr) => {
	return arr.reduce((prev, item) => prev + item.students.length, 0);
};

export default countStudents;
