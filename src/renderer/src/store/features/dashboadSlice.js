import { createSlice } from '@reduxjs/toolkit'

export const dashboard = createSlice({
  name: 'dashboard',
  initialState: {
    areas: [],
    accessPoints: [],
    state: false,
    announcements: true,
    focusedAccessPoint: 0,
    activeEmergencies: []
  },
  reducers: {
    setAccessPointEmergency: (state, { payload }) => {
      state.activeEmergencies.push(payload)
      state.accessPoints = state.accessPoints.map((ap) => {
        if (ap.access_point_id === payload) {
          return { ...ap, emergency: true }
        }
        return ap
      })
    },
    setDashboardData: (state, { payload }) => {
      state.areas = payload?.areas
      state.accessPoints = payload?.access_points
      state.state = true
    },
    setFocusedAccesspoint: (state, { payload }) => {
      state.focusedAccessPoint = payload
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
      //state.accessPoints = payload
      state.accessPoints = payload.map((ap) => {
        if (state.activeEmergencies.includes(ap.access_point_id)) {
          return { ...ap, emergency: true }
        }
        return { ...ap, emergency: false }
      })
    },
    setSeenAnnouncements: (state) => {
      state.announcements = !state.announcements
    },
    turnOffEmergencies: (state) => {
      state.activeEmergencies = []
      state.accessPoints = state.accessPoints.map((ap) => ({ ...ap, emergency: false }))
    }
  }
})

export const {
  setDashboardData,
  updateAccessPoint,
  turnOffEmergencies,
  setAccessPointStatus,
  setSeenAnnouncements,
  setFocusedAccesspoint,
  setAccessPointEmergency,
  updateAccessPointMeasurements
} = dashboard.actions

export default dashboard.reducer
