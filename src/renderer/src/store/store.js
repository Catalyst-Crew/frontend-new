import { configureStore, createSelector } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import usersReducer from './features/usersSlice'
import dashboadReducer from './features/dashboadSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    user: usersReducer,
    dashboardData: dashboadReducer
  },
  devTools: true
})

export const selectAuth = (state) => state.auth
export const selectUser = createSelector(selectAuth, (auth) => (auth.user ? auth.user.id : null))
export const selectDashboardData = (state) => state.dashboardData
export const selectUserRole = createSelector(selectAuth, (auth) =>
  auth.user ? auth.user.user_role_id : null
)
export const selectUserArea = createSelector(selectAuth, (auth) =>
  auth.user ? auth.user.area_id : null
)
export const selectUserAccess = createSelector(selectAuth, (auth) =>
  auth.user ? auth.user.access_id : null
)
export const selectUserToken = createSelector(selectAuth, (auth) =>
  auth.user ? auth.user.token : 'token'
)
export const selectUserState = createSelector(selectAuth, (auth) => auth.state)
export const selectUsers = createSelector(selectUser, (user) => user)

export const selectDashboard = createSelector(selectDashboardData, (dashboardData) => dashboardData)
export const selectAreas = createSelector(
  selectDashboardData,
  (dashboardData) => dashboardData.areas
)
export const selectAccessPoints = createSelector(
  selectDashboardData,
  (dashboardData) => dashboardData.accessPoints
)
