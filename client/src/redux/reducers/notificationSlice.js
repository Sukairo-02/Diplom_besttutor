import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
	name: 'notification',
	initialState: [],
	reducers: {
		addNote: (state, action) => {
			state.push(action.payload);
		},
		removeNote: (state, action) => {
			return state.filter((item) => item.id !== action.payload);
		},
	},
});

export const { addNote, removeNote } = notificationSlice.actions;

export default notificationSlice.reducer;
