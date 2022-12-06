function postRequest(url: string, body: object, accessToken?: string) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': ''
    };

    if (accessToken !== undefined) headers['Authorization'] = `Bearer ${accessToken}`;

    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });
}

function getRequest(url: string, accessToken?: string) {
    let headers = {
        'Authorization': ''
    };

    if (accessToken !== undefined) headers['Authorization'] = `Bearer ${accessToken}`;

    return fetch(url, {headers});
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

export async function getCanvasBitmap(accessToken: string): Promise<ApiCallStatus<string>> {
    const resp = await getRequest('/api/area', accessToken);
    const body = await resp.text();
    
    if (!resp.ok) return {success: false, message: body, payload: ''};

    return {
        success: true,
        payload: body
    };
}