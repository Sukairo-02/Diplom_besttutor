import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './reducers/userInfoSlice';
import subjectsReducer from './reducers/subjectsSlice';

export default configureStore({
	reducer: {
		userInfo: userInfoReducer,
		subjects: subjectsReducer,
	},
});
