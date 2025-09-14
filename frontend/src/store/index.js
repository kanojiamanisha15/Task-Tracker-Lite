import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import taskSlice from "./slices/taskSlice";
import categorySlice from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
    categories: categorySlice,
  },
});

// TypeScript type definitions (commented out for JavaScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
