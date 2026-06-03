import { configureStore } from "@reduxjs/toolkit";
import { aiPickerApi } from "../features/aiPicker/api/aiPickerApi";

export const store = configureStore({
  reducer: {
    [aiPickerApi.reducerPath]: aiPickerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(aiPickerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

