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
    },
    setAccessPointStatus: (state, { payload }) => {
      state.accessPoints.forEach(ap => {
        if (ap.access_point_id === payload.access_point_id) {
          ap.access_point_status = payload.access_point_status;
        }
      });
    },
    updateAccessPointLocation: (state, { payload }) => {
      state.accessPoints.forEach(ap => {
        if (ap.access_point_id === payload.access_point_id) {
          ap.access_point_latitude = payload.access_point_latitude;
          ap.access_point_longitude = payload.access_point_longitude;
        }
      });
    },
    updateAccessPointMeasurements: (state, { payload }) => {
      state.accessPoints.forEach(ap => {
        if (ap.access_point_id === payload.access_point_id) {
          if (payload.measurements) {
            ap.measurements = ap.measurements || [];
            payload.measurements.forEach(measurement => {
              const index = ap.measurements.findIndex(m => m.id === measurement.id);
              if (index !== -1) {
                ap.measurements[index] = measurement;
              } else {
                ap.measurements.push(measurement);
              }
            });
          } else {
            ap.measurements = null;
          }
        }
      });
    },
  }
})

export const { setDashboardData, setAccessPointStatus, updateAccessPointLocation, updateAccessPointMeasurements } = dashboard.actions

export default dashboard.reducer
