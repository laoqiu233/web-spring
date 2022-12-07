import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import { ApiCallStatus, JwtTokenPair, loginUser, refreshTokens, registerUser } from "../../utils/ApiClient";

interface UserAuthInfo {
    username: string,
    accessToken: string
}

interface AuthState {
    userInfo: UserAuthInfo,
    authenticated: boolean
    status: 'idle' | 'pending' | 'success' | 'failed'
}

const initialState: AuthState = {
    userInfo: {
        username: '',
        accessToken: ''
    },
    authenticated: false,
    status: 'idle'
};

export function validateUsernamePassword(username: string, password: string): AppThunk<Promise<ApiCallStatus<JwtTokenPair>>> {
    return async function(dispatch, getState) {
        const result = await loginUser(username, password);

        if (result.success) {
            localStorage.setItem('refreshToken', result.payload.refreshToken);
            dispatch(authenticate({username, accessToken: result.payload.accessToken}));
        }

        return result;
    }
}

export function registerAndAuthenticateUser(username: string, password: string) :AppThunk<Promise<ApiCallStatus<JwtTokenPair>>> {
    return async function(dispatch, getState) {
        const result = await registerUser(username, password);
        
        if (result.success) {
            localStorage.setItem('refreshToken', result.payload.refreshToken);
            dispatch(authenticate({username, accessToken: result.payload.accessToken}));
        }

        return result;
    } 
}

// export async function refreshUserCredentials(dispatch: AppDispatch, getState: () => RootState): Promise<ApiCallStatus<JwtTokenPair>> {
//     const oldRefreshToken = localStorage.getItem("refreshToken");
//     if (oldRefreshToken === null) return {success: false, message: 'No refresh token available', payload: {accessToken: '', refreshToken: ''}};

//     const result = await refreshTokens(oldRefreshToken);

//     if (result.success) {
//         const sub = jwtDecode<JwtPayload>(result.payload.accessToken).sub;
//         if (sub === undefined) return {success: false, message: 'Invalid tokens', payload: result.payload};

//         localStorage.setItem('refreshToken', result.payload.refreshToken);
//         dispatch(authenticate({accessToken: result.payload.accessToken, username:sub}));
//     }

//     return result;
// }

export const refreshUserCredentials = createAsyncThunk<
    UserAuthInfo,
    void,
    {
        state: RootState
        dispatch: AppDispatch,
        rejectValue: string
    }
>(
    'auth/refreshUserCredentials',
    async (noArg, thunkApi) => {
        const oldRefreshToken = localStorage.getItem('refreshToken');
        if (oldRefreshToken === null) return thunkApi.rejectWithValue('No refresh token found');

        const result = await refreshTokens(oldRefreshToken);
        
        if (result.success) {
            const { accessToken, refreshToken } = result.payload;
            const sub = jwtDecode<JwtPayload>(result.payload.accessToken).sub;
            if (sub === undefined) return thunkApi.rejectWithValue('Invalid token');

            localStorage.setItem('refreshToken', refreshToken);
            return {accessToken, username: sub};
        }

        return thunkApi.rejectWithValue(result.message || 'Something went wrong');
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticate: (state, action: PayloadAction<UserAuthInfo> ) => {
            state.userInfo = action.payload;
            state.authenticated = true;
        },
        logout: (state) => {
            state.userInfo.username = '';
            state.userInfo.accessToken = '';
            state.authenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(refreshUserCredentials.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(refreshUserCredentials.fulfilled, (state, action) => {
            state.userInfo = action.payload;
            state.authenticated = true;
            state.status = 'success';
        })
        .addCase(refreshUserCredentials.rejected, (state, action) => {
            state.status = 'failed';
        })
    }
});

export const { authenticate, logout } = authSlice.actions;