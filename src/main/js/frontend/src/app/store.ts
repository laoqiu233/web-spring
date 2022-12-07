import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authSlice } from '../features/auth/authSlice';
import { pointsSlice } from '../features/points/pointsSlice';
import { toastsSlice } from '../features/toasts/toastsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    points: pointsSlice.reducer,
    toasts: toastsSlice.reducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
