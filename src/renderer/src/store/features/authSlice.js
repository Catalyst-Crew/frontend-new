import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    state: false
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
