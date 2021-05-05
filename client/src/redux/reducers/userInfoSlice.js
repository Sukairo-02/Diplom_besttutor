import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthProvider } from '../../jwt';

const { authFetch } = createAuthProvider();

export const fetchUserInfo = createAsyncThunk(
	'userInfo/fetchUserInfo',
	async () => {
		const response = await authFetch('/api/auth/userdata');
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
	},
});

export default userInfoSlice.reducer;
