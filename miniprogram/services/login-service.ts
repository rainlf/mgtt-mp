import { request } from "./request-service";


export const login = (code: string): Promise<User> => {
    return request({
        url: `/user/login?code=${code}`,
        method: 'GET',
    });
}