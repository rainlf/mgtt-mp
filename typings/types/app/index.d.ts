interface User {
    id: number;
    username: string;
    avatar: string;
    points: number;
    lastTags: string[];
    createdTime: string;
    updatedTime: string;
    selected: boolean;
    lastSelected: boolean;
    gameInfo: UserGameInfo;
}

interface UserGameInfo {
    basePoints: number;
    winTypes: string[];
    multi: number;
}

// declare enum GameType {
//     PING_HU,
//     ZI_MO,
// }
//
// declare namespace GameType {
//     export function getObj(type: GameType) {
//         switch (type) {
//             case GameType.PING_HU:
//                 return { label: "平胡", code: 1}
//             case GameType.ZI_MO:
//                 return { label: "自摸", code: 2}
//         }
//     }
// }

// const GameType = {
//     PING_HU = { label: "平胡", code: 1},
//     ZI_MO = { label: "自摸", code: 2},
// } as const;

// const WinType = {
//     WU_HUA_GUO: { label: "无花果", code: 1, multiplier: 1 },
//     PENG_PENG_HU: { label: "碰碰胡", code: 2, multiplier: 2 },
//     YI_TIAO_LONG: { label: "一条龙", code: 3, multiplier: 2 },
//     HUN_YI_SE: { label: "混一色", code: 4, multiplier: 2 },
//     QING_YI_SE: { label: "清一色", code: 5, multiplier: 4 },
//     XIAO_QI_DUI: { label: "小七对", code: 6, multiplier: 2 },
//     LONG_QI_DUI: { label: "龙七对", code: 7, multiplier: 4 },
//     DA_DIAO_CHE: { label: "大吊车", code: 8, multiplier: 2 },
//     MEN_QING: { label: "门清", code: 9, multiplier: 2 },
//     GANG_KAI: { label: "杠开", code: 10, multiplier: 2 },
// } as const;
//
// // 类型定义（TypeScript 需要）
// type WinTypeKey = keyof typeof WinType;
// type WinTypeValue = typeof WinType[WinTypeKey];

interface MajiangLog {
    id: number;
    type: string;
    player1: User;
    player2: User;
    player3: User;
    player4: User;
    createdTime: string;
    updatedTime: string;
    winners: MajiangLogItem[];
    losers: MajiangLogItem[];
    recorder: MajiangLogItem;
}

interface MajiangLogItem {
    user: User;
    points: number;
    tags: string[];
}

interface MajiangPlayers {
    currentPlayers: User[];
    allPlayers: User[];
}