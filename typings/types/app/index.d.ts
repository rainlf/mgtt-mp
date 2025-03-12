interface User {
    id: number;
    username: string;
    avatar: string;
    points: number;
    lastTags: string[];
    createdTime: string;
    updatedTime: string;
    selected: boolean;
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