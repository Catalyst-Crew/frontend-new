import { createSlice } from '@reduxjs/toolkit'

export const alerts = createSlice({
  name: 'alerts',
  initialState: {
    alerts: [],
    active: false
  },
  reducers: {
    setAlerts: (state, { payload }) => {
      state.alerts = [...state.alerts, { ...payload, active: true }]
      state.active = true
    },
    setAlertStatus: (state, { payload }) => {
      state.alerts.forEach((alert) => {
        if (alert.alert_id == payload) {
          alert.active === false
        }
      })
    },
    setAlertsOff: (state) => {
      state.active = false
    }
  }
})

export const { setAlertStatus, setAlerts, setAlertsOff } = alerts.actions

export default alerts.reducer
