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
    deleteIcon: string;
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