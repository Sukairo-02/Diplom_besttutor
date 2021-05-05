import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchSubjects = createAsyncThunk(
	'userInfo/fetchSubjects',
	async () => {
		const response = await authFetch('/api/school/getSubjects');
		return response.json();
	}
);

export const subjectsSlice = createSlice({
	name: 'subjects',
	initialState: {
		items: [],
		loading: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: {
		[fetchSubjects.pending]: (state) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchSubjects.fulfilled]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.items = action.payload.subjects;
			}
		},
		[fetchSubjects.rejected]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},
	},
});

export default subjectsSlice.reducer;
