import { createSlice } from '@reduxjs/toolkit'

export const dashboard = createSlice({
  name: 'dashboard',
  initialState: {
    areas: [],
    accessPoints: [],
    state: false,
    announcements: true
  },
  reducers: {
    setDashboardData: (state, { payload }) => {
      state.areas = payload?.areas
      state.accessPoints = payload?.access_points
      state.state = true
    },
    setAccessPointStatus: (state, { payload }) => {
      state.accessPoints.forEach((ap) => {
        if (ap.access_point_id === payload.access_point_id) {
          ap.access_point_status = payload.access_point_status
        }
      })
    },
    updateAccessPoint: (state, { payload }) => {
      state.accessPoints.forEach((ap) => {
        if (ap.access_point_id === payload.access_point_id) {
          ap.area_id = payload.area_id
          ap.area_name = payload.area_name
          ap.access_point_name = payload.access_point_name
          ap.access_point_latitude = payload.access_point_latitude
          ap.access_point_longitude = payload.access_point_longitude
        }
      })
    },
    updateAccessPointMeasurements: (state, { payload }) => {
      state.accessPoints = payload
    },
    setSeenAnnouncements: (state) => {
      state.announcements = !state.announcements
    }
  }
})

export const {
  setDashboardData,
  setAccessPointStatus,
  updateAccessPoint,
  updateAccessPointMeasurements,
  setSeenAnnouncements
} = dashboard.actions

export default dashboard.reducer
