import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchUserInfo = createAsyncThunk(
	'userInfo/fetchUserInfo',
	async () => {
		const response = await authFetch('/api/auth/userdata');
		const data = await response.json();

		if (data.courses.length) {
			const userCourses = await authFetch('/api/school/usercourses/');
			const userCoursesData = await userCourses.json();

			data.courses = userCoursesData.courses;

			return data;
		}

		return data;
	}
);

export const fetchTeacherCourses = createAsyncThunk(
	'userInfo/fetchTeacherCourses',
	async () => {
		const response = await authFetch('/api/school/courses/');
		return response.json();
	}
);

export const fetchUserCourses = createAsyncThunk(
	'userInfo/fetchUserCourses',
	async () => {
		const response = await authFetch('/api/school/usercourses/');
		return response.json();
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

		[fetchUserCourses.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchUserCourses.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.info.courses = action.payload.courses;
			}
		},
		[fetchUserCourses.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},
	},
});

export default userInfoSlice.reducer;
