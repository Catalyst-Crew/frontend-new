import { createSlice } from '@reduxjs/toolkit'

export const dashboard = createSlice({
  name: 'dashboard',
  initialState: {
    data: [],
    state: false
  },
  reducers: {
    setDashboardData: (state, { payload }) => {
      state.data = payload
      state.state = true
    }
  }
})

export const { setDashboardData } = dashboard.actions

export default dashboard.reducer
