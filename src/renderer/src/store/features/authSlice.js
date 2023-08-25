import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTMwNTEwOTUsImRhdGEiOjEwMDAwMDEsImlhdCI6MTY5Mjk2NDY5NX0.mspDfSR2VtGeZbFmweRziQJpzm72piO2qursT7Lre1s',
      identity: 'user-1000001',
      id: 1_000_001,
      id_prefix: 'user-',
      name: 'Axole Maranjana',
      email: 'axolemaranjana4@gmail.com',
      password: '',
      user_role_id: 1_000_000,
      phone: '0681721606',
      access_id: 1_000_000,
      area_id: 1_000_000
    },
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

// interface IAuthState {
//   user: IUser | null
//   state: boolean
// }

// interface IUser {
//   token: string
//   identity: string
//   id: number
//   id_prefix: string
//   name: string
//   email: string
//   password: string
//   user_role_id: number
//   phone: string
//   access_id: number
//   area_id: number
// }

// Path: src\renderer\src\store\features\authSlice.ts
