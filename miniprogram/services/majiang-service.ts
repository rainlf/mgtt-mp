import {request} from "./request-service";


export const getMajiangLog = (): Promise<MajiangLog[]> => {
    return request({
        url: `/majiang/games`,
        method: 'GET',
    });
}

