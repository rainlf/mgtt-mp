import {getUserInfo, getUserRank} from "../../services/user-service";

Page({
    data: {
        user: {} as User,
        isRefreshing: false,
        rankList: [] as User[],
        // rain
        gameList: [] as User[],
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
        this.fetchGameList()
    },

    handleRankListLoad() {
        this.fetchUserRank()
    },
    handleGameListLoad() {
        this.fetchGameList()
    },

    fetchUserRank() {
        getUserRank().then(rankList => {
            this.setData({rankList})
        })
    },
    fetchGameList() {
        // rain
        getUserRank().then(rankList => {
            this.setData({rankList})
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
        this.setData({
            showGameLog: false
        })
        console.log('rain openUserRank', this.data.showGameLog)
    },

    openGameLog() {
        this.setData({
            showGameLog: true
        })
        console.log('rain openGameLog', this.data.showGameLog)
    },

    saveGameLog() {
        console.log('saveGameLog');
    }

})
