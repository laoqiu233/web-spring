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

async function handleResponse<T>(resp: Response, successCallback: (resp: Response) => Promise<ApiCallStatus<T>>, payloadOnError:T): Promise<ApiCallStatus<T>> {
    if (resp.ok) {
        return await successCallback(resp);
    } else {
        const body = await resp.text();
        try {
            return {success: false, message: JSON.parse(body).message, payload: payloadOnError};
        } catch (e) {
            return {success: false, message: body, payload: payloadOnError};
        }
    }
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
    return handleResponse(resp, async (r) => {
        const body = await r.json();
        return {success: true, payload: {accessToken: body.accessToken, refreshToken: body.refreshToken}};
    }, {accessToken: '', refreshToken: ''});
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
    x: number[],
    y: number[],
    r: number[]
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

export interface PagedPointsResponse {
    points: PointAttempt[],
    pageNum: number,
    pageCount: number,
    totalPointsCount: number
};

function transformPoint(v: any) {
    return {
        id: v.id,
        x: v.point.x,
        y: v.point.y,
        r: v.point.r,
        user: v.username,
        attemptTime: v.attemptTime,
        processTime: v.processTime,
        success: v.success
    }
}

export async function getPoints(page:number, onlyOwned:boolean, accessToken: string) : Promise<ApiCallStatus<PagedPointsResponse>> {
    const resp = await getRequest(`/api/points?page=${page}&owned=${onlyOwned}`, accessToken);

    return handleResponse(resp, async (r) => {
        const pointsResp: PagedPointsResponse = await r.json();
        const pointsTransformed = {
            ...pointsResp,
            points: pointsResp.points.map(transformPoint)
        };
        return {success: true, payload: pointsTransformed};
    }, {points:[], pageNum:0, pageCount:0, totalPointsCount:0});
}

export async function sendPoints(points: CompoundPointRequest, accessToken: string) : Promise<ApiCallStatus<PointAttempt[]>> {
    const resp = await postRequest('/api/points', points, accessToken);

    return handleResponse(resp, async (r) => {
        const points = await r.json();
        const pointsTransformed: PointAttempt[] = points.map(transformPoint);
        return {success: true, payload: pointsTransformed};
    }, []);
}