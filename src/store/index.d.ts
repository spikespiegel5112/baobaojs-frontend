
// Type definitions for Redux store
declare module "./slices/counterSlice" {
  import { Reducer } from "@reduxjs/toolkit";
  const counterReducer: Reducer;
  export default counterReducer;
}
