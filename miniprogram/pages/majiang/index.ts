import {getUserInfo, getUserRank} from "../../services/user-service";
import {getMajiangLog, getMajiangLogByUser} from "../../services/majiang-service";
import {updateAvatarFromCache} from "../../utils/util";

Page({
    data: {
        user: {} as User,
        isRefreshing: false,
        rankList: [] as User[],
        gameList: [] as MajiangLog[],
        userGameList: [] as MajiangLog[],
        showUserRank: true,
        showGameLog: false,
        showUserGameLog: false,
        showUserRankBtn: false,
        showDrawer: false,
    },
    onLoad() {
    },
    onShow(): void | Promise<void> {
        const user: User = wx.getStorageSync('user')
        if (user) {
            this.setData({user})
        }

        this.fetchUserInfo()
        // this.fetchGameList()
        this.fetchUserRank()
    },

    // 子组件下拉刷新触发
    handleRankListLoad() {
        this.fetchUserInfo()
        // this.fetchGameList()
        this.fetchUserRank()
    },
    handleGameListLoad() {
        this.fetchUserInfo()
        this.fetchGameList()
        // this.fetchUserRank()
    },

    // 后台获取数据
    fetchUserRank() {
        getUserRank().then(rankList => {
            this.setData({rankList})
            // 本地头像缓存
            const avatars = rankList.map((item) => ({id: item.id, avatar: item.avatar}))
            wx.setStorageSync('avatars', avatars)
        })
    },
    fetchGameList() {
        getMajiangLog().then(data => {
            const user: User = wx.getStorageSync("user")
            const avatars = wx.getStorageSync('avatars')
            console.log('rain1', data)
            const gameList = data.map(item => {
                if (item.recorder.user.id === user.id) {
                    return {
                        ...item,
                        deleteIcon: '/images/delete.png',
                        player1: {...item.player1, avatar: updateAvatarFromCache(item.player1.id, avatars)},
                        player2: {...item.player2, avatar: updateAvatarFromCache(item.player2.id, avatars)},
                        player3: {...item.player3, avatar: updateAvatarFromCache(item.player3.id, avatars)},
                        player4: {...item.player4, avatar: updateAvatarFromCache(item.player4.id, avatars)},
                        losers: item.losers.map(loser => ({
                            ...loser,
                            user: {...loser.user, avatar: updateAvatarFromCache(loser.user.id, avatars)},
                        })),
                        winners: item.winners.map(winner => ({
                            ...winner,
                            user: {...winner.user, avatar: updateAvatarFromCache(winner.user.id, avatars)},
                        }))
                    }
                } else {
                    return {
                        ...item,
                        deleteIcon: '/images/delete2.png',
                        player1: {...item.player1, avatar: updateAvatarFromCache(item.player1.id, avatars)},
                        player2: {...item.player2, avatar: updateAvatarFromCache(item.player2.id, avatars)},
                        player3: {...item.player3, avatar: updateAvatarFromCache(item.player3.id, avatars)},
                        player4: {...item.player4, avatar: updateAvatarFromCache(item.player4.id, avatars)},
                        losers: item.losers.map(loser => ({
                            ...loser,
                            user: {...loser.user, avatar: updateAvatarFromCache(loser.user.id, avatars)},
                        })),
                        winners: item.winners.map(winner => ({
                            ...winner,
                            user: {...winner.user, avatar: updateAvatarFromCache(winner.user.id, avatars)},
                        }))
                    }
                }
            })
            console.log('rain', gameList)
            this.setData({gameList})
        })
    },
    fetchUserInfo() {
        getUserInfo(this.data.user.id).then(user => {
            this.setData({user});
        })
    },
    fetchUserGameList(userId: number) {
        const avatars = wx.getStorageSync('avatars')
        getMajiangLogByUser(userId).then(data => {
            const userGameList =  data.map(item => {
                return {
                    ...item,
                    player1: {...item.player1, avatar: updateAvatarFromCache(item.player1.id, avatars)},
                    player2: {...item.player2, avatar: updateAvatarFromCache(item.player2.id, avatars)},
                    player3: {...item.player3, avatar: updateAvatarFromCache(item.player3.id, avatars)},
                    player4: {...item.player4, avatar: updateAvatarFromCache(item.player4.id, avatars)},
                    losers: item.losers.map(loser => ({
                        ...loser,
                        user: {...loser.user, avatar: updateAvatarFromCache(loser.user.id, avatars)},
                    })),
                    winners: item.winners.map(winner => ({
                        ...winner,
                        user: {...winner.user, avatar: updateAvatarFromCache(winner.user.id, avatars)},
                    }))
                }
            })
            this.setData({userGameList})
        })
    },


    onRefresh() {
        if (this.data.isRefreshing) {
            return;
        }

        this.setData({
            isRefreshing: true,
        });

        this.loadData().finally(() => {
            this.setData({
                isRefreshing: false,
            });
        });
    },

    async loadData() {
        this.fetchUserInfo()
        // this.fetchGameList()
        this.fetchUserRank()
    },

    // 点击玩家排行按钮
    openUserRank() {
        this.fetchUserInfo()
        this.fetchUserRank()
        this.setData({
            showUserRank: true,
            showGameLog: false,
            showUserGameLog: false,
            showUserRankBtn: false,
        })
    },

    // 点击游戏记录按钮
    openGameLog() {
        this.fetchUserInfo()
        this.fetchGameList()
        this.setData({
            showUserRank: false,
            showGameLog: true,
            showUserGameLog: false,
            showUserRankBtn: true
        })
    },

    // 子组件点击头像
    handleClickUserAvatar(e: any) {
        const userId = e.detail.userId
        this.fetchUserGameList(userId)
        this.setData({
            showUserRank: false,
            showGameLog: false,
            showUserGameLog: true,
            showUserRankBtn: true
        })
    },

    // 刷新分数、排名、记录
    refreshData() {
        this.fetchUserInfo()
        this.fetchUserRank()
        this.fetchGameList()
    },

    showSaveGameLog() {
        this.setData({
            showDrawer: true
        })
    },
})
