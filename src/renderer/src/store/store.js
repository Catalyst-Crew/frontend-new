import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import usersReducer from './features/usersSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    user: usersReducer
  }
})
