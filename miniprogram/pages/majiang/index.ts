import {getUserInfo, getUserRank} from "../../services/user-service";
import {getMajiangLog} from "../../services/majiang-service";

Page({
    data: {
        user: {} as User,
        isRefreshing: false,
        rankList: [] as User[],
        gameList: [] as MajiangLog[],
        showGameLog: false,
    },
    onLoad() {
    },
    onShow(): void | Promise<void> {
        const user: User = wx.getStorageSync('user')
        if (user) {
            this.setData({user})
        }

        this.fetchUserRank()
    },

    // 子组件下拉刷新触发
    handleRankListLoad() {
        this.fetchUserRank()
    },
    handleGameListLoad() {
        this.fetchGameList()
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
        const user = await getUserInfo(this.data.user.id)
        this.setData({user});
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

    saveGameLog() {
        console.log('saveGameLog');
    }

})
