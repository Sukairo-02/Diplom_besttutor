import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchTeachers = createAsyncThunk(
	'teachers/fetchTeachers',
	async () => {
		const response = await authFetch('/api/auth/userlist/TCHR');
		return response.json();
	}
);

export const teachersSlice = createSlice({
	name: 'teachers',
	initialState: {
		items: [],
		loading: 'idle',
		error: null,
	},
	reducers: {},
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
	},
});

export default teachersSlice.reducer;
