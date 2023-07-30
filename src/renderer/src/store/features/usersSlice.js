import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '../../utils/exports'

export const usersSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    getUsers: (state, action) => {
      axios
        .get(`${API_URL}/users`, { headers: { 'x-access-token': action.payload.token } })
        .then((res) => {
          if (res.status === 200) {
            state = res.data.data
          }
        })
        .catch(() => {
          //console.log(err)
        })
    },
    addUser: (state, action) => {
      axios
        .post(`${API_URL}/users`, action.payload, {
          headers: { 'x-access-token': action.payload.token }
        })
        .then((res) => {
          if (res.status === 200) {
            state.push(res.data)
          }
        })
        .catch(() => {
          //console.log(err)
        })
    },
    updateUser: (state, action) => {
      axios
        .put(`${API_URL}/users/${action.payload.id}`, action.payload, {
          headers: { 'x-access-token': action.payload.token }
        })
        .then((res) => {
          if (res.status === 200) {
            state = res.data
          }
        })
        .catch(() => {
          //console.log(err)
        })
    }
  }
})

// Action creators are generated for each case reducer function
export const { getUsers } = usersSlice.actions

export default usersSlice.reducer
