import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchTaskForTeacher = createAsyncThunk(
	'task/fetchTaskForTeacher',
	async (id) => {
		const data = await authFetch('/api/school/getassignment_teacher', 'POST', {
			assignmentID: id,
		});
		return data.assignment;
	}
);

export const fetchStatisticForTeacher = createAsyncThunk(
	'task/fetchStatisticForTeacher',
	async (id) => {
		const data = await authFetch('/api/school/getstatistic', 'POST', {
			assignmentID: id,
		});
		return data;
	}
);

export const fetchTaskForStudent = createAsyncThunk(
	'task/fetchTaskForStudent',
	async (id) => {
		const data = await authFetch('/api/school/getassignment', 'POST', {
			assignmentID: id,
		});
		return data;
	}
);

export const taskSlice = createSlice({
	name: 'task',
	initialState: {
		item: {},
		statistic: {},
		loading: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: {
		[fetchTaskForTeacher.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchTaskForTeacher.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';

				action.payload.date = action.payload.date.slice(0, 10);
				action.payload.endDate = action.payload.endDate.slice(0, 10);

				state.item = action.payload;
			}
		},
		[fetchTaskForTeacher.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},

		[fetchStatisticForTeacher.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchStatisticForTeacher.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.statistic = action.payload.statistics;
			}
		},
		[fetchStatisticForTeacher.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},

		[fetchTaskForStudent.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchTaskForStudent.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';

				action.payload.date = action.payload.date.slice(0, 10);
				action.payload.endDate = action.payload.endDate.slice(0, 10);

				action.payload.questions.forEach((question) => {
					question.answers.forEach((answer) => {
						answer.isChecked = false;
					});
				});

				state.item = action.payload;
			}
		},
		[fetchTaskForStudent.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},
	},
});

export default taskSlice.reducer;
