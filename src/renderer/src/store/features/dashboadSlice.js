import { createSlice } from '@reduxjs/toolkit'

export const dashboard = createSlice({
  name: 'dashboard',
  initialState: {
    areas: [],
    accessPoints: [],
    state: false
  },
  reducers: {
    setDashboardData: (state, { payload }) => {
      state.areas = payload?.areas
      state.accessPoints = payload?.access_points
      state.state = true
    }
  }
})

export const { setDashboardData } = dashboard.actions

export default dashboard.reducer
