// store/userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id?: number;
  userName?: string;
  token?: string;
  role?: string | null;
}

type UserInfoState = UserInfo | null;

const initialState: UserInfoState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfoState>) {
      return action.payload;
    },
    clearUserInfo(state) {
      return null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
