

Page({
    data: {
        user: {} as User,
    },
    onLoad() {
        const user: User = wx.getStorageSync('user')
        if (user) {
            this.setData({user})
        }
    }
})
