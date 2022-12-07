import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../app/store";
import { ApiCallStatus, getAllPoints, PointAttempt } from "../../utils/ApiClient";

interface PointsState {
    points: PointAttempt[]
}

const initialState: PointsState = {
    points: []
}

export async function loadPointsFromApi(dispatch: AppDispatch, getState: () => RootState) : Promise<ApiCallStatus<PointAttempt[]>> {
    if (getState().auth.authenticated) {
        const result = await getAllPoints(getState().auth.userInfo.accessToken);
        
        if (result.success) {
            dispatch(pointsLoaded(result.payload));
        }
        
        return result;
    } else {
        console.log('Trying to get points while not authenticated');
        return {success: false, message: 'Not authenticated', payload: []};
    }
}

export const pointsSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {
        pointsLoaded: (state, action: PayloadAction<PointAttempt[]>) => {
            state.points = action.payload;
        }
    } 
});

export const { pointsLoaded } = pointsSlice.actions;