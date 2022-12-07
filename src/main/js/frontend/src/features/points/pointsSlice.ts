import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStaticContextFromError } from "@remix-run/router";
import { AppDispatch, RootState } from "../../app/store";
import { ApiCallStatus, CompoundPointRequest, getAllPoints, PointAttempt, sendPoints } from "../../utils/ApiClient";

interface PointsState {
    points: PointAttempt[],
    status: 'idle' | 'pending' | 'success' | 'failed'
}

const initialState: PointsState = {
    points: [],
    status: 'idle'
}

export const loadPointsFromApi = createAsyncThunk<
    PointAttempt[],
    boolean,
    {
        dispatch: AppDispatch,
        state: RootState,
        rejectValue: string
    }
>(
    'points/fetchPoints',
    async (onlyOwnedPoints, thunkApi) => {
        const { authenticated, userInfo: { accessToken } } = thunkApi.getState().auth;

        if (!authenticated) return thunkApi.rejectWithValue('Unauthenticated');

        const result = await getAllPoints(accessToken);

        if (result.success) {
            return result.payload;
        }

        return thunkApi.rejectWithValue(result.message || 'Unknown error');
    }
)

export const pointsSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loadPointsFromApi.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(loadPointsFromApi.fulfilled, (state, action) => {
            state.status = 'success';
            state.points = action.payload;
        })
        .addCase(loadPointsFromApi.rejected, (state, action) => {
            state.status = 'failed';
            state.points = [];
        })
    }
});