// src/store/slices/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    addByAmount(state, action) {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, addByAmount } = counterSlice.actions;
export default counterSlice.reducer;
