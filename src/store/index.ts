// store/index.ts
import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id?: number;
  userName?: string;
  token?: string;
  role?: string | null;
}

type UserInfoState = UserInfo | null;

interface CounterState {
  value: number;
}

// ===== user slice =====
const userSlice = createSlice({
  name: "user",
  initialState: null as UserInfoState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfoState>) {
      return action.payload;
    },
    clearUserInfo() {
      return null;
    },
  },
});

// ===== counter slice =====
import counterSlice from "./slices/counterSlice";

// ===== isLoggedIn slice =====
const isLoggedInSlice = createSlice({
  name: "isLoggedIn",
  initialState: false,
  reducers: {
    setIsLoggedIn(state, action) {
      return action.payload;
    },
  },
});

// ===== store =====
export const store = configureStore({
  reducer: {
    userInfo: userSlice.reducer,
    isLoggedIn: isLoggedInSlice.reducer,
  },
});

// ===== 导出 actions =====
export const { setUserInfo, clearUserInfo } = userSlice.actions;
export { increment, decrement } from "./slices/counterSlice";
export const { setIsLoggedIn } = isLoggedInSlice.actions;

// ===== TS 类型辅助 =====
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
