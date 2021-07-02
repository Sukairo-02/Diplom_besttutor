import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

const removeItem = (arr, value) => {
	const index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
};

const removeItems = (arr) => {
	arr.length = 0;
};

const addItem = (arr, value) => {
	arr.push(value);
};

export const fetchUserInfo = createAsyncThunk(
	'userInfo/fetchUserInfo',
	async () => {
		const data = await authFetch('/api/auth/userdata');
		return data;
	}
);

export const fetchBoughtCourses = createAsyncThunk(
	'userInfo/fetchBoughtCourses',
	async () => {
		const data = await authFetch('/api/school/usercourses/');
		return data;
	}
);

export const fetchTeacherCourses = createAsyncThunk(
	'userInfo/fetchTeacherCourses',
	async () => {
		const data = await authFetch('/api/school/courses/');

		const mappeedData = data.courses.map((course) => ({
			...course,
			lessons: course.lessons.map((lesson) => ({
				...lesson,
				courseID: course._id,
			})),
			assignments: course.assignments.map((assignment) => ({
				...assignment,
				courseID: course._id,
			})),
			usersdata: course.usersdata.map((user) => ({
				...user,
				courseID: course._id,
			})),
		}));

		const lessons = mappeedData.reduce(
			(prev, curr) => [...prev, ...curr.lessons],
			[]
		);

		const assignments = mappeedData.reduce(
			(prev, curr) => [...prev, ...curr.assignments],
			[]
		);

		const usersdata = mappeedData.reduce(
			(prev, curr) => [...prev, ...curr.usersdata],
			[]
		);

		const courses = mappeedData.map(
			({
				_id,
				desc,
				isBlocked,
				isPublished,
				price,
				subject,
				teacher,
				title,
			}) => ({
				_id,
				desc,
				isBlocked,
				isPublished,
				price,
				subject,
				teacher,
				title,
				lessonsIds: lessons.reduce((prev, curr) => {
					if (curr.courseID === _id) {
						return [...prev, curr._id];
					}
					return prev;
				}, []),
				assignmentsIds: assignments.reduce((prev, curr) => {
					if (curr.courseID === _id) {
						return [...prev, curr._id];
					}
					return prev;
				}, []),
				usersdataIds: usersdata.reduce((prev, curr) => {
					if (curr.courseID === _id) {
						return [...prev, curr.id];
					}
					return prev;
				}, []),
			})
		);

		return { courses, lessons, assignments, usersdata };
	}
);

export const teacherCoursesAdapter = createEntityAdapter({
	selectId: (course) => course._id,
});

export const lessonsAdapter = createEntityAdapter({
	selectId: (lesson) => lesson._id,
});

export const assignmentsAdapter = createEntityAdapter({
	selectId: (assignment) => assignment._id,
});

export const usersDataAdapter = createEntityAdapter({
	selectId: (user) => user.id,
});

export const userInfoSlice = createSlice({
	name: 'userInfo',
	initialState: {
		info: {},
		courses: [],
		teacherCourses: {
			courses: teacherCoursesAdapter.getInitialState(),
			lessons: lessonsAdapter.getInitialState(),
			assignments: assignmentsAdapter.getInitialState(),
			usersdata: usersDataAdapter.getInitialState(),
		},
		error: null,
	},
	reducers: {
		updateInfo: (state, { payload }) => {
			state.info = { ...state.info, ...payload };
		},

		teacherCourseAdd: (state, payload) => {
			teacherCoursesAdapter.addOne(state.teacherCourses.courses, payload);
		},
		teacherCourseDelete: (state, payload) => {
			teacherCoursesAdapter.removeOne(state.teacherCourses.courses, payload);
		},
		teacherCourseUpdate: (state, payload) => {
			teacherCoursesAdapter.updateOne(state.teacherCourses.courses, payload);
		},

		teacherLessonAdd: (state, { payload }) => {
			lessonsAdapter.addOne(state.teacherCourses.lessons, payload.data);
			addItem(
				state.teacherCourses.courses.entities[payload.courseID].lessonsIds,
				payload.lessonID
			);
		},
		teacherLessonDelete: (state, { payload }) => {
			lessonsAdapter.removeOne(state.teacherCourses.lessons, payload.lessonID);
			removeItem(
				state.teacherCourses.courses.entities[payload.courseID].lessonsIds,
				payload.lessonID
			);
		},

		teacherAssignmentAdd: (state, { payload }) => {
			assignmentsAdapter.addOne(state.teacherCourses.assignments, payload.data);
			addItem(
				state.teacherCourses.courses.entities[payload.courseID].assignmentsIds,
				payload.assignmentID
			);
		},
		teacherAssignmentDelete: (state, { payload }) => {
			assignmentsAdapter.removeOne(
				state.teacherCourses.assignments,
				payload.assignmentID
			);
			removeItem(
				state.teacherCourses.courses.entities[payload.courseID].assignmentsIds,
				payload.assignmentID
			);
		},

		teacherUserdataDelete: (state, { payload }) => {
			usersDataAdapter.removeOne(
				state.teacherCourses.usersdata,
				payload.userdataID
			);
			removeItem(
				state.teacherCourses.courses.entities[payload.courseID].usersdataIds,
				payload.userdataID
			);
		},
		teacherUsersdataDelete: (state, { payload }) => {
			usersDataAdapter.removeMany(
				state.teacherCourses.usersdata,
				payload.userdatasID
			);
			removeItems(
				state.teacherCourses.courses.entities[payload.courseID].usersdataIds
			);
		},
	},
	extraReducers: {
		[fetchUserInfo.fulfilled]: (state, { payload }) => {
			payload.dateOfBirth = payload.dateOfBirth.slice(0, 10);
			state.info = payload;
		},
		[fetchUserInfo.rejected]: (state, action) => {
			state.error = action.error;
		},

		[fetchBoughtCourses.fulfilled]: (state, { payload }) => {
			for (let i = 0; i < payload?.courses?.length; i++) {
				for (let j = 0; j < payload.courses[i].lessons.length; j++) {
					payload.courses[i].lessons[j].date = payload.courses[i].lessons[
						j
					].date.slice(0, 10);
					payload.courses[i].lessons[j].endDate = payload.courses[i].lessons[
						j
					].endDate.slice(0, 10);
				}
			}

			state.courses = payload.courses;
		},
		[fetchBoughtCourses.rejected]: (state, action) => {
			state.error = action.error;
		},

		[fetchTeacherCourses.fulfilled]: (state, { payload }) => {
			payload.lessons.forEach((lesson) => {
				lesson.date = lesson.date.slice(0, 10);
				lesson.endDate = lesson.endDate.slice(0, 10);
			});

			teacherCoursesAdapter.setAll(
				state.teacherCourses.courses,
				payload.courses
			);

			lessonsAdapter.setAll(state.teacherCourses.lessons, payload.lessons);

			assignmentsAdapter.setAll(
				state.teacherCourses.assignments,
				payload.assignments
			);

			usersDataAdapter.setAll(
				state.teacherCourses.usersdata,
				payload.usersdata
			);
		},
		[fetchTeacherCourses.rejected]: (state, action) => {
			state.error = action.error;
		},
	},
});

export const { selectAll: selectAllTeacherCourses } =
	teacherCoursesAdapter.getSelectors(
		(state) => state.userInfo.teacherCourses.courses
	);

export const { selectById: selectLessonById } =
	teacherCoursesAdapter.getSelectors(
		(state) => state.userInfo.teacherCourses.lessons
	);

export const { selectById: selectUserById } =
	teacherCoursesAdapter.getSelectors(
		(state) => state.userInfo.teacherCourses.usersdata
	);

export const { selectById: selectAssignmentById } =
	assignmentsAdapter.getSelectors(
		(state) => state.userInfo.teacherCourses.assignments
	);

export const {
	updateInfo,
	teacherCourseAdd,
	teacherCourseDelete,
	teacherCourseUpdate,
	teacherLessonAdd,
	teacherLessonDelete,
	teacherAssignmentAdd,
	teacherAssignmentDelete,
	teacherUserdataDelete,
	teacherUsersdataDelete,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
