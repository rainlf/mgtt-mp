import {request} from "./request-service";


export const login = (code: string): Promise<User> => {
    return request({
        url: `/user/login?code=${code}`,
        method: 'GET',
    });
}

export const updateUsername = (userId: number, username: string): Promise<void> => {
    return request({
        url: `/user/username?userId=${userId}&username=${username}`,
        method: 'POST',
    });
}

export const getUserInfo = (userId: number): Promise<User> => {
    return request({
        url: `/user/info?userId=${userId}`,
        method: 'GET',
    });
}

export const getUserRank = (): Promise<User[]> => {
    return request({
        url: `/user/rank`,
        method: 'GET',
    });
}

