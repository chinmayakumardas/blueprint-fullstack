import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './features/authSlice';
import sidebarReducer from './features/sidebarSlice';
import viewAllTeamReducer from './features/viewallteamSlice';
import projectOnboardingReducer from './features/projectonboardingSlice';
import fetchallProjectsReducer from './features/fetchallProjectsSlice'; 
import viewProjectsByIdReducer from './features/viewProjectsByIdSlice';
import projectReducer from './features/projectSlice';
import clientReducer from './features/clientSlice'; // Import your client slice
import dashboardReducer from './features/dashboardSlice';

import teamMembersReducer from './features/teamMembersSlice';
import viewTeamByProjectIdReducer from './features/viewTeamByProjectIdSlice';
import taskReducer from './features/TaskSlice';
import notificationReducer from './features/notificationSlice';
import bugReducer from './features/bugSlice';
import userReducer from './features/userSlice';
import dashReducer from './features/dashSlice';
import meetingReducer from './features/meetingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  sidebar: sidebarReducer,
  
  viewAllTeam: viewAllTeamReducer,
  projectOnboarding: projectOnboardingReducer,
  fetchallProjects: fetchallProjectsReducer,
  projectView: viewProjectsByIdReducer,
  client:clientReducer,
  project:projectReducer,
  dashboard:dashboardReducer,
  task:taskReducer,

  teamMembers: teamMembersReducer,
  projectTeam: viewTeamByProjectIdReducer,
  notifications: notificationReducer,
  bugs: bugReducer,
  user: userReducer,
  dash: dashReducer,
  meetings: meetingReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
