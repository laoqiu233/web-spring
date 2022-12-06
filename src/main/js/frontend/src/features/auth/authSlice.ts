import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import { ApiCallStatus, JwtTokenPair, loginUser, refreshTokens, registerUser } from "../../utils/ApiClient";

interface AuthState {
    userInfo: UserAuthInfo,
    authenticated: boolean
}

interface UserAuthInfo {
    username: string,
    accessToken: string
}

const initialState: AuthState = {
    userInfo: {
        username: '',
        accessToken: ''
    },
    authenticated: false
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

export async function refreshUserCredentials(dispatch: AppDispatch, getState: () => RootState): Promise<ApiCallStatus<JwtTokenPair>> {
    const oldRefreshToken = localStorage.getItem("refreshToken");
    if (oldRefreshToken === null) return {success: false, message: 'No refresh token available', payload: {accessToken: '', refreshToken: ''}};

    const result = await refreshTokens(oldRefreshToken);

    if (result.success) {
        const sub = jwtDecode<JwtPayload>(result.payload.accessToken).sub;
        if (sub === undefined) return {success: false, message: 'Invalid tokens', payload: result.payload};

        localStorage.setItem('refreshToken', result.payload.refreshToken);
        dispatch(authenticate({accessToken: result.payload.accessToken, username:sub}));
    }

    return result;
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticate: (state, action: PayloadAction<UserAuthInfo> ) => {
            state.userInfo = action.payload;
            state.authenticated = true;
        },
        updateAccessToken: (state, action: PayloadAction<string>) => {
            state.userInfo.accessToken = action.payload;
        },
        logout: (state) => {
            state.userInfo.username = '';
            state.userInfo.accessToken = '';
            state.authenticated = false;
        }
    }
});

export const { authenticate, updateAccessToken, logout } = authSlice.actions;