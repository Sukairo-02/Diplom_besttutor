import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './reducers/userInfoSlice';
import subjectsReducer from './reducers/subjectsSlice';
import teachersSlice from './reducers/teachersSlice';
import taskSlice from './reducers/taskSlice';
import notificationSlice from './reducers/notificationSlice';

export default configureStore({
	reducer: {
		userInfo: userInfoReducer,
		subjects: subjectsReducer,
		teachers: teachersSlice,
		task: taskSlice,
		notifications: notificationSlice,
	},
});
