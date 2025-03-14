import {request} from "./request-service";


export const getMajiangLog = (): Promise<MajiangLog[]> => {
    return request({
        url: `/majiang/games`,
        method: 'GET',
    });
}

export const deleteMajiangLog = (gameId: number): Promise<void> => {
    return request({
        url: `/majiang/game?id=${gameId}`,
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

