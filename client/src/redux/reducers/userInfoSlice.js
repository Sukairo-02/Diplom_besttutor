import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchUserInfo = createAsyncThunk(
	'userInfo/fetchUserInfo',
	async () => {
		const data = await authFetch('/api/auth/userdata');

		if (data?.courses?.length) {
			const userCourses = await authFetch('/api/school/usercourses/');
			data.courses = userCourses.courses;
		}

		if (data?.teacherCourses?.length) {
			const teacherCourses = await authFetch('/api/school/courses/');
			data.teacherCourses = teacherCourses.courses;
		}

		return data;
	}
);

export const fetchTeacherCourses = createAsyncThunk(
	'userInfo/fetchTeacherCourses',
	async () => {
		const data = await authFetch('/api/school/courses/');
		return data;
	}
);

export const userInfoSlice = createSlice({
	name: 'userInfo',
	initialState: {
		info: {},
		loading: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: {
		[fetchUserInfo.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchUserInfo.fulfilled]: (state, { payload }) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';

				payload.dateOfBirth = payload.dateOfBirth.slice(0, 10);

				for (let i = 0; i < payload?.teacherCourses?.length; i++) {
					for (let j = 0; j < payload.teacherCourses[i].lessons.length; j++) {
						payload.teacherCourses[i].lessons[j].date = payload.teacherCourses[
							i
						].lessons[j].date.slice(0, 10);
						payload.teacherCourses[i].lessons[j].endDate =
							payload.teacherCourses[i].lessons[j].endDate.slice(0, 10);
					}
				}

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

				state.info = payload;
			}
		},
		[fetchUserInfo.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},

		[fetchTeacherCourses.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchTeacherCourses.fulfilled]: (state, { payload }) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';

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

				state.info.teacherCourses = payload.courses;
			}
		},
		[fetchTeacherCourses.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},
	},
});

export default userInfoSlice.reducer;
