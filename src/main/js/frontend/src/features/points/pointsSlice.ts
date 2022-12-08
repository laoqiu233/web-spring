import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStaticContextFromError } from "@remix-run/router";
import { AppDispatch, RootState } from "../../app/store";
import { ApiCallStatus, CompoundPointRequest, getPoints, PagedPointsResponse, PointAttempt, sendPoints } from "../../utils/ApiClient";

interface PointsState {
    points: PointAttempt[],
    currentPage: number,
    totalPages: number,
    totalPointsCount: number,
    status: 'idle' | 'pending' | 'success' | 'failed'
}

interface PointsFetchRequest {
    page: number,
    onlyOwned: boolean
}

const initialState: PointsState = {
    points: [],
    currentPage: 0,
    totalPages: 0,
    totalPointsCount: 0,
    status: 'idle'
}

export const loadPointsFromApi = createAsyncThunk<
    PagedPointsResponse,
    PointsFetchRequest,
    {
        dispatch: AppDispatch,
        state: RootState,
        rejectValue: string
    }
>(
    'points/fetchPoints',
    async ({page, onlyOwned}, thunkApi) => {
        const { authenticated, userInfo: { accessToken } } = thunkApi.getState().auth;

        if (!authenticated) return thunkApi.rejectWithValue('Unauthenticated');

        const result = await getPoints(page, onlyOwned, accessToken);

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
            state.currentPage = action.payload.pageNum;
            state.totalPages = action.payload.pageCount;
            state.totalPointsCount = action.payload.totalPointsCount;
            state.points = action.payload.points;
        })
        .addCase(loadPointsFromApi.rejected, (state, action) => {
            state.status = 'failed';
            state.points = [];
            state.currentPage = 0;
            state.totalPages = 0;
            state.totalPointsCount = 0;
        })
    }
});