import {login} from "../../services/user-service";

Page({
    data: {
        progress: 0,
        intervalId: null as number | null,
        message: '正在检查登录状态...',
    },
    onShow() {
        // 启动假进度条
        this.startProgressBar()
        // 微信登录
        this.wxLogin()
    },
    tap2Login() {
        const user: User = wx.getStorageSync("user")
        if (user.username != null && user.username != '' && user.avatar != null) {
            wx.navigateTo({
                url: '../majiang/index',
            })
        } else {
            wx.navigateTo({
                url: '../login/index',
            })
        }

    },
    startProgressBar() {
        const intervalId = setInterval(() => {
            let progress = this.data.progress;
            if (progress < 100) {
                progress += 10;
                this.setData({
                    progress
                });
            } else {
                clearInterval(intervalId);
            }
        }, 300);
        this.setData({
            intervalId
        });
    },
    wxLogin() {
        wx.login({
            success: res => {
                console.log('code:', res.code)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId

                login(res.code)
                    .then((user: User) => {
                        // 用户信息埋入 wx storage
                        wx.setStorageSync('user', user);

                        if (user.username != null && user.username != '' && user.avatar != null) {
                            this.setData({
                                progress: 100,
                                message: '登录成功',
                            });
                            setTimeout(() => {
                                wx.navigateTo({
                                    url: '../majiang/index',
                                })
                            }, 500);
                        } else {
                            this.setData({
                                progress: 100,
                                message: '登录成功'
                            });
                            setTimeout(() => {
                                wx.navigateTo({
                                    url: '../login/index',
                                })
                            }, 500);
                        }
                    })
                    .catch((err: Error) => {
                        console.error('error:', err);
                        this.setData({
                            progress: 100,
                            message: `服务器异常，管理员正在迷路中...`,
                        });
                    })
                    .finally(() => {
                        setTimeout(() => {
                            if (this.data.intervalId != null) {
                                clearInterval(this.data.intervalId);
                            }
                        }, 500);
                    })
            },
        })
    },
    onUnload() {
        // 清除进度条的定时器
        if (this.data.intervalId != null) {
            clearInterval(this.data.intervalId);
        }
    }
});