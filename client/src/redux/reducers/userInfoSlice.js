import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchUserInfo = createAsyncThunk(
	'userInfo/fetchUserInfo',
	async () => {
		const data = await authFetch('/api/auth/userdata');

		if (data.courses.length) {
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
		[fetchUserInfo.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.info = action.payload;
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
		[fetchTeacherCourses.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.info.teacherCourses = action.payload.courses;
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
