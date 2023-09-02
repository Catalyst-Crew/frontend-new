import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTM3NDc4OTYsImRhdGEiOjEwMDAwMDEsImlhdCI6MTY5MzY2MTQ5Nn0.SWrZhjjwYPeEdKvKZa7kGE3uyhVaVkjh-3quOV7tHVk",
      "identity": "user-1000001",
      "id": 1000001,
      "id_prefix": "user-",
      "name": "Axole Maranjana",
      "email": "axolemaranjana4@gmail.com",
      "password": "",
      "user_role_id": 1000000,
      "phone": "27681721606",
      "access_id": 1000000,
      "area_id": 1000000
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

// Path: src\renderer\src\store\features\authSlice.ts
