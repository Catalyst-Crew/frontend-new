import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTY1NTU3MDIsImRhdGEiOnsiaWRlbnRpdHkiOiIiLCJpZCI6MTAwMDAwMSwiaWRfcHJlZml4IjoidXNlci0iLCJuYW1lIjoiQXhvbGUgTWFyYW5qYW5hIiwiZW1haWwiOiJheG9sZW1hcmFuamFuYTRAZ21haWwuY29tIiwicGFzc3dvcmQiOiIiLCJ1c2VyX3JvbGVfaWQiOjEwMDAwMDAsInBob25lIjoiMjc2ODE3MjE2MDYiLCJhY2Nlc3NfaWQiOjEwMDAwMDAsImFyZWFfaWQiOjEwMDAwMDB9LCJpYXQiOjE2OTY1MjY5MDJ9.9lfAnL8JY_pRl2EvbBmxxPBtH6GWActb0fsQFiX_5Xs',
      identity: 'user-1000001',
      id: 1000001,
      id_prefix: 'user-',
      name: 'Axole Maranjana',
      email: 'axolemaranjana4@gmail.com',
      password: '',
      user_role_id: 1000000,
      phone: '27681721606',
      access_id: 1000000,
      area_id: 1000000
    },
    state: true
  },
  reducers: {
    login: (state, action) => {
      state.state = action.payload.state
      state.user = action.payload.user
    },
    logout: (state) => {
      state.user = null
      state.state = false
    }
  }
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer

// Path: src\renderer\src\store\features\authSlice.ts
