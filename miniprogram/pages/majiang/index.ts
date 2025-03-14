import {getUserInfo, getUserRank} from "../../services/user-service";
import {getMajiangLog} from "../../services/majiang-service";

Page({
    data: {
        user: {} as User,
        isRefreshing: false,
        rankList: [] as User[],
        gameList: [] as MajiangLog[],
        showGameLog: false,
        showDrawer: true,
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
        getMajiangLog().then(gameList => {
            this.setData({gameList})
        })
    },
    fetchUserInfo() {
        getUserInfo(this.data.user.id).then(user => {
            this.setData({user});
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

    openUserRank() {
        this.fetchUserRank()
        this.setData({
            showGameLog: false
        })
    },

    openGameLog() {
        this.fetchGameList()
        this.setData({
            showGameLog: true
        })
    },

    showSaveGameLog() {
        this.setData({
            showDrawer: true
        })
    },
})
