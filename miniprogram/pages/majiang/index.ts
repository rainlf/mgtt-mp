import {getUserInfo} from "../../services/user-service";

Page({
    data: {
        user: {} as User,
        isRefreshing: false,
    },
    onLoad() {
    },
    onShow(): void | Promise<void> {
        this.syncUserInfo()
    },
    syncUserInfo() {
        const user: User = wx.getStorageSync('user')
        if (user) {
            this.setData({user})
        }
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
