import { access } from "fs";

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
    if (resp.ok) {
        const body = await resp.json();
        return {success: true, payload: {accessToken: body.accessToken, refreshToken: body.refreshToken}};
    }
    
    const body = await resp.text()
    let err = '';

    try {
        const json = JSON.parse(body);
        err = json.message;
    } catch (e) {
        err = body;
    }
    

    return {success: false, message: err, payload: {accessToken: '', refreshToken: ''}};
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

export interface CompoundPointRequest {
    xs: number[],
    ys: number[],
    rs: number[]
};

export interface PointAttempt {
    id: number,
    x: number,
    y: number,
    r: number,
    attemptTime: number,
    processTime: number,
    success: boolean,
    user: string
};

export async function getAllPoints(accessToken: string) : Promise<ApiCallStatus<PointAttempt[]>> {
    const resp = await getRequest('/api/points', accessToken);

    if (resp.ok) {
        const points = await resp.json();
        const pointsTransformed: PointAttempt[] = points.map((v:any) => ({
            id: v.id,
            x: v.point.x,
            y: v.point.y,
            r: v.point.r,
            user: v.username,
            attemptTime: v.attemptTime,
            processTime: v.processTime,
            success: v.success
        }))
        return {success: true, payload: pointsTransformed};
    } else {
        const body = await resp.text();
        try {
            return {success: false, message: JSON.parse(body).message, payload: []};
        } catch (e) {
            return {success: false, message: body, payload: []};
        }
    }
}