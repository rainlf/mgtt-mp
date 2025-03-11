import {getUserInfo, getUserRank} from "../../services/user-service";

Page({
    data: {
        user: {} as User,
        isRefreshing: false,
        rankList: [] as User[],
    },
    onLoad() {
    },
    onShow(): void | Promise<void> {
        const user: User = wx.getStorageSync('user')
        if (user) {
            this.setData({user})
        }

        getUserRank().then(rankList => {
            this.setData({rankList})
            // this.setData({rankList: rankList.slice(0, 2)})
        })
    },

    handleComponentLoad() {
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
        console.log('loadData', user)
        this.setData({user});
    }
})
