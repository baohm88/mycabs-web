import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { unreadCount: 0, connected: false },
  reducers: {
    setUnread(state, { payload }){ state.unreadCount = payload ?? 0 },
    setConnected(state, { payload }){ state.connected = !!payload },
  }
})

export const { setUnread, setConnected } = uiSlice.actions
export default uiSlice.reducer