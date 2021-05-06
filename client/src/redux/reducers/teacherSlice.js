import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchTeacher = createAsyncThunk(
	'teachers/fetchTeacher',
	async (id) => {
		const response = await authFetch(`/api/auth/userdataID/${id}`);
		return response.json();
	}
);

export const teacherSlice = createSlice({
	name: 'teacher',
	initialState: {
		info: {},
		loading: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: {
		[fetchTeacher.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchTeacher.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.info = action.payload;
			}
		},
		[fetchTeacher.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},
	},
});

export default teacherSlice.reducer;
