// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// 推断类型（TS 专用）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
