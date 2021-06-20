import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';
import { countRating, byField } from '../../util';

const { authFetch } = createAuthProvider();

export const fetchTeachers = createAsyncThunk(
	'teachers/fetchTeachers',
	async () => {
		const data = await authFetch('/api/auth/userlist/TCHR');
		return data;
	}
);

export const fetchTeacher = createAsyncThunk(
	'teachers/fetchTeacher',
	async (id) => {
		const data = await authFetch(`/api/auth/userdataID/${id}`);
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

		if (reviews.length) {
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

		return reviews;
	}
);

export const teachersSlice = createSlice({
	name: 'teachers',
	initialState: {
		items: [],
		filter: '',
		teacher: {},
		loading: 'idle',
		error: null,
	},
	reducers: {
		setTeacher: (state, action) => {
			const teacher = state.items.find((item) => item._id === action.payload);
			state.teacher = teacher;
		},
		setFilter: (state, action) => {
			state.filter = action.payload;
		},
		sortItems: (state, action) => {
			switch (action.payload) {
				case 'pointsAsc':
					state.items.sort(
						byField('reviews', true, (item) => countRating(item))
					);
					break;
				case 'pointsDesc':
					state.items.sort(
						byField('reviews', false, (item) => countRating(item))
					);
					break;
				case 'reviews':
					state.items.sort(byField('reviews', true, (item) => item.length));
					break;
				case 'corses':
					state.items.sort(
						byField('teacherCourses', true, (item) => item.length)
					);
					break;
				default:
					state.items.sort(
						byField('reviews', true, (item) => countRating(item))
					);
					break;
			}
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

		[fetchTeacher.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchTeacher.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.teacher = action.payload;
			}
		},
		[fetchTeacher.rejected]: (state, action) => {
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

export const { setTeacher, sortItems, setFilter } = teachersSlice.actions;

export default teachersSlice.reducer;
