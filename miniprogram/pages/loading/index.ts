import {login} from "../../services/login-service";

Page({
    data: {
        progress: 0,
        intervalId: null as number | null,
    },
    onLoad() {
        // 启动假进度条
        this.startProgressBar()
        // 微信登录
        this.wxLogin()
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
                    .then((data: User) => {
                        console.log('data:', data);
                        if (data.username != null && data.avatar != null) {
                            console.log('userinfo exist, register to home page')
                            this.setData({
                                progress: 100
                            });
                            setTimeout(() => {
                                wx.navigateTo({
                                    url: '../logs/logs',
                                })
                            }, 500);
                        } else {
                            console.log('userinfo missing, register to login page')
                            this.setData({
                                progress: 100
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
                    })
                    .finally(() => {
                        if (this.data.intervalId != null) {
                            clearInterval(this.data.intervalId);
                        }
                    })
            },
        })
    },
    onUnload() {
        // 清除进度条的定时器
        console.log('loading page onUnload...');
        if (this.data.intervalId != null) {
            clearInterval(this.data.intervalId);
        }
    }
});