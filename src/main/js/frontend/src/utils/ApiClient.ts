function postRequest(url: string, body: object) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

export interface ApiCallStatus<T> {
    success: boolean,
    message?: string,
    payload: T
}

export interface JwtTokenPair {
    accessToken: string,
    refreshToken: string
}

async function extractJwtTokenPairFromResponse(resp: Response): Promise<ApiCallStatus<JwtTokenPair>> {
    const body = await resp.json();

    if (resp.ok) {
        return {success: true, payload: {accessToken: body.accessToken, refreshToken: body.refreshToken}};
    }
    
    return {success: false, message: body.message, payload: {accessToken: '', refreshToken: ''}};
}

export async function registerUser(username:string, password:string): Promise<ApiCallStatus<JwtTokenPair>> {
    const resp = await postRequest('/api/auth/register', {username, password});
    return extractJwtTokenPairFromResponse(resp);
}

export async function loginUser(username:string, password:string): Promise<ApiCallStatus<JwtTokenPair>> {
    const resp = await postRequest('/api/auth/login', {username, password});
    return extractJwtTokenPairFromResponse(resp);
}

export async function refreshTokens(refreshToken: string): Promise<ApiCallStatus<JwtTokenPair>> {
    const resp = await postRequest('/api/auth/refresh', {refreshToken});
    return extractJwtTokenPairFromResponse(resp);
}