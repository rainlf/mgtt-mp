Page({
    data: {
        user: {},
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
    }
})
