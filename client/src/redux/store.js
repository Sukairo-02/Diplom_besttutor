import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './reducers/userInfoSlice';
import subjectsReducer from './reducers/subjectsSlice';
import teachersSlice from './reducers/teachersSlice';
import taskSlice from './reducers/taskSlice';

export default configureStore({
	reducer: {
		userInfo: userInfoReducer,
		subjects: subjectsReducer,
		teachers: teachersSlice,
		task: taskSlice,
	},
});
