import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchTeachers = createAsyncThunk(
	'teachers/fetchTeachers',
	async () => {
		const data = await authFetch('/api/auth/userlist/TCHR');
		return data;
	}
);

export const fetchTeacherCourses = createAsyncThunk(
	'teachers/fetchTeacherCourses',
	async (id) => {
		const data = await authFetch(`/api/school/courses/${id}`);
		return data;
	}
);

export const fetchTeacherReviews = createAsyncThunk(
	'teachers/fetchTeacherReviews',
	async (_, { getState }) => {
		const {
			teacher: { reviews },
		} = getState().teachers;
		const usersIds = reviews.map((review) => review.author);

		const data = await authFetch('/api/auth/lightdataArr/', 'POST', {
			ids: usersIds,
		});

		const newReviews = [];

		await reviews.forEach((review) => {
			data.users.forEach((user) => {
				if (review.author === user._id) {
					newReviews.push(
						(review = {
							...review,
							...user,
						})
					);
				}
			});
		});

		return newReviews;
	}
);

export const teachersSlice = createSlice({
	name: 'teachers',
	initialState: {
		items: [],
		teacher: {},
		loading: 'idle',
		error: null,
	},
	reducers: {
		setTeacher: (state, action) => {
			const teacher = state.items.find((item) => item._id === action.payload);
			state.teacher = teacher;
		},
	},
	extraReducers: {
		[fetchTeachers.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchTeachers.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.items = action.payload.users;
			}
		},
		[fetchTeachers.rejected]: (state, action) => {
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
				state.teacher.teacherCourses = action.payload.courses;
			}
		},
		[fetchTeacherCourses.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},

		[fetchTeacherReviews.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchTeacherReviews.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.teacher.reviews = action.payload;
			}
		},
		[fetchTeacherReviews.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},
	},
});

export const { setTeacher } = teachersSlice.actions;

export default teachersSlice.reducer;
