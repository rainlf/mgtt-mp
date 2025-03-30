import {request} from "./request-service";


export const getMajiangLog = (): Promise<MajiangLog[]> => {
    return request({
        url: `/majiang/games`,
        method: 'GET',
    });
}

export const getMajiangLogByUser = (userId: number): Promise<MajiangLog[]> => {
    return request({
        url: `/majiang/user/games?userId=${userId}`,
        method: 'GET',
    });
}

export const deleteMajiangLog = (gameId: number, userId: number): Promise<void> => {
    return request({
        url: `/majiang/game?id=${gameId}&userId=${userId}`,
        method: 'DELETE',
    });
}

export const getMajiangPlayers = (): Promise<MajiangPlayers> => {
    return request({
        url: `/majiang/game/players`,
        method: 'GET',
    });
}

export const saveMaJiangGame = (data: any): Promise<number> => {
    return request({
        url: `/majiang/game`,
        method: 'POST',
        data,
    });
}

