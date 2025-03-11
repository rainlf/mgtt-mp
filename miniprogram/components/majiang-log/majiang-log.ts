Component({
    properties: {
        listData: {
            type: Array,
            value: []
        },
    },
    data: {
        isRefreshing: false,
        gameRecords: [
            {
                winType: "一炮双响",
                time: "2024-05-20 14:30",
                bookkeeper: "麻将小助手",
                bookkeeperPoint: 100,
                winners: [{
                    avatar: "/images/test.png",
                    nickname: "糖炒栗子",
                    score: 40,
                    tags: ["庄家", "连庄"]
                }],
                losers: [{
                    avatar: "/images/test.png",
                    nickname: "玩家B",
                    score: 20,
                    tags: ["点炮"]
                },{
                    avatar: "/images/test.png",
                    nickname: "玩家C",
                    score: 20,
                    tags: []
                }]
            },
            {
                winType: "一炮双响",
                time: "2024-05-20 14:30",
                bookkeeper: "麻将小助手",
                bookkeeperPoint: 100,
                winners: [{
                    avatar: "/images/test.png",
                    nickname: "糖炒栗子",
                    score: 40,
                    tags: ["庄家", "连庄"]
                }],
                losers: [{
                    avatar: "/images/test.png",
                    nickname: "玩家B",
                    score: 20,
                    tags: ["点炮"]
                },{
                    avatar: "/images/test.png",
                    nickname: "玩家C",
                    score: 20,
                    tags: []
                }]
            }
        ]
    },
    methods: {
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
            try {
                // 触发父页面方法（带参数）
                this.triggerEvent('load', {
                    from: 'component'
                }, {
                    bubbles: true,  // 是否冒泡
                    composed: true  // 是否跨越组件边界
                })
            } catch (e) {
                console.error(e)
            }
        }
    }
})