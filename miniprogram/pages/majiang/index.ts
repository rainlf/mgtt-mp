import {getUserInfo, getUserRank} from "../../services/user-service";
import {getMajiangLog, getMajiangLogByUser} from "../../services/majiang-service";

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
        this.fetchGameList()
        this.fetchUserRank()
    },

    // 子组件下拉刷新触发
    handleRankListLoad() {
        this.fetchUserInfo()
        this.fetchGameList()
        this.fetchUserRank()
    },
    handleGameListLoad() {
        this.fetchUserInfo()
        this.fetchGameList()
        this.fetchUserRank()
    },

    // 后台获取数据
    fetchUserRank() {
        getUserRank().then(rankList => {
            this.setData({rankList})
        })
    },
    fetchGameList() {
        getMajiangLog().then(data => {
            const user: User = wx.getStorageSync("user")
            const gameList = data.map(item => {
                if (item.recorder.user.id === user.id) {
                    return {...item, deleteIcon: '/images/delete.png'}
                } else {
                    return {...item, deleteIcon: '/images/delete2.png'}
                }
            })
            this.setData({gameList})
        })
    },
    fetchUserInfo() {
        getUserInfo(this.data.user.id).then(user => {
            this.setData({user});
        })
    },
    fetchUserGameList(userId: number) {
        getMajiangLogByUser(userId).then(userGameList => {
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
        this.fetchGameList()
        this.fetchUserRank()
    },

    // 点击玩家排行按钮
    openUserRank() {
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
