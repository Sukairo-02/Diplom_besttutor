// subjectSlice
export const getSubjects = (state) => state.subjects.items;

// taskSlice
export const getTask = (state) => state.task.item;
export const getStatistic = (state) => state.task.statistic;

// teachersSlice
export const getTeachers = (state) => state.teachers.items;
export const getTeacher = (state) => state.teachers.teacher;
export const getTeachersFilter = (state) => state.teachers.filter;

// userInfoSlice
export const getUserInfo = (state) => state.userInfo.info;

// notificationSlice
export const getNotifications = (state) => state.notifications;
