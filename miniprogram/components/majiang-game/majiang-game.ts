import {getMajiangPlayers} from "../../services/majiang-service";

Component({
    properties: {
        showDrawer: {
            type: Boolean,
            value: true
        }
    },
    data: {
        gameType: '平胡', // 默认选中平胡
        allPlayers: [] as User[],
        winPlayers: [] as User[],
        losePlayers: [] as User[],
        changingPlayers: false,
        selectUserToPlayList: [] as number[],
        showButton: true,

        // 底分
        basePoints: 0,
        points: [
            {name: 2, point: 2, selected: false},
            {name: 3, point: 3, selected: false},
            {name: 4, point: 4, selected: false},
            {name: 5, point: 5, selected: false},
            {name: 6, point: 6, selected: false},
            {name: 7, point: 7, selected: false},
            {name: 8, point: 8, selected: false},
            {name: '🍒', point: 10, selected: false},
        ],

        // 牌型
        multi: 1,
        winTypes: [
            {name: '碰碰胡', multi: 2, selected: false},
            {name: '一条龙', multi: 2, selected: false},
            {name: '混一色', multi: 2, selected: false},
            {name: '清一色', multi: 4, selected: false},
            {name: '小七对', multi: 2, selected: false},
            {name: '龙七对', multi: 4, selected: false},
            {name: '门前清', multi: 2, selected: false},
            {name: '杠开花', multi: 2, selected: false},
        ],
    },
    lifetimes: {
        attached() {
            console.log('rain, attached');
            getMajiangPlayers().then((res) => {
                const currentIds = res.currentPlayers.map((player: User) => (player.id))
                this.setData({
                    winPlayers: res.currentPlayers.map((player: User, index: number) => ({
                        ...player,
                        selected: index === 0,
                        lastSelected: index === 0
                    })),
                    losePlayers: res.currentPlayers.map((player: User) => ({...player, selected: false})),
                    allPlayers: res.allPlayers
                        .map((player: User) => {
                            if (currentIds.includes(player.id)) {
                                return {...player, selected: true}
                            } else {
                                return {...player, selected: false}
                            }
                        }),
                    selectUserToPlayList: currentIds,
                })
            })
        },
    },
    methods: {
        // 清空
        handleDelete() {
            console.log('handleDelete');
        },

        // 底分
        selectTag(e: any) {
            const name = e.currentTarget.dataset.name;
            const selected = e.currentTarget.dataset.selected;
            const point = e.currentTarget.dataset.point;
            console.log('selectTag', name, selected, point);

            this.setData({
                points: this.data.points.map((point: any) => {
                    if (point.name === name) {
                        return {...point, selected: true};
                    } else {
                        return {...point, selected: false};
                    }
                }),
                basePoints: point
            })
        },
        handleDecrease() {
            const target = this.data.basePoints - 1
            if (target < 0) {
                wx.showToast({
                    title: '底分不能小于 0 呀 😏',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            this.setData({
                basePoints: target
            })
        },
        handleIncrease() {
            const target = this.data.basePoints + 1
            if (target > 20) {
                wx.showToast({
                    title: '底分是不是太大了呀 😏',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            this.setData({
                basePoints: target
            })
        },
        // 翻倍牌型
        toggleWinType(e: any) {
            const name = e.currentTarget.dataset.name;
            const multi = e.currentTarget.dataset.multi;
            const selected = e.currentTarget.dataset.selected;
            console.log('selectTag', name, multi, selected);

            let totalMulti = this.data.multi
            if (selected) {
                // 取消点击
                totalMulti /= multi
            } else {
                // 点击
                totalMulti *= multi
            }

            this.setData({
                winTypes: this.data.winTypes.map((type: any) => {
                    if (type.name === name) {
                        return {...type, selected: !type.selected}
                    } else {
                        return type
                    }
                }),
                multi: totalMulti
            })
        },


        closeDrawer() {
            console.log('close drawer')
            this.setData({showDrawer: false})
        },

        submit() {
            console.log('submit')
            this.setData({showDrawer: false})
        },
        // 选择胡牌类型
        selectWinType(e: any) {
            const type = e.currentTarget.dataset.type;
            this.setData({gameType: type});
        },
        // 选择玩家
        selectWinPlayer(e: any) {
            const playerId = e.currentTarget.dataset.id;
            const selected = e.currentTarget.dataset.selected;
            console.log('rain, selectWinPlayer', playerId, selected);

            if (this.data.gameType === '多赢家') {
                let count = 0
                this.data.winPlayers.forEach((player: User) => {
                    if (player.selected) {
                        count++
                    }
                })
                if (selected === false && count >= 3) {
                    wx.showToast({
                        title: '最多 3 个赢家 😏',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
                this.setData({
                    winPlayers: this.data.winPlayers.map((player: User) => {
                        if (player.id === playerId) {
                            return {...player, selected: !player.selected, lastSelected: true}
                        } else {
                            return {...player, lastSelected: false};
                        }
                    }),
                })
            } else {
                this.setData({
                    winPlayers: this.data.winPlayers.map((player: User) => {
                        if (player.id === playerId) {
                            return {...player, selected: !player.selected, lastSelected: true}
                        } else {
                            // 反选其他
                            return {...player, selected: false, lastSelected: false}
                        }
                    }),
                })
            }
        },
        selectLosePlayer(e: any) {
            const playerId = e.currentTarget.dataset.id;
            // const selected = e.currentTarget.dataset.selected;
            this.setData({
                losePlayers: this.data.losePlayers.map((player: User) => {
                    if (player.id === playerId) {
                        return {...player, selected: !player.selected}
                    } else {
                        // 反选其他
                        return {...player, selected: false}
                    }
                }),
            })
        },
        selectPlayerToPlay(e: any) {
            const playerId = e.currentTarget.dataset.id;
            const selected = e.currentTarget.dataset.selected;

            if (selected === false && this.data.selectUserToPlayList.length >= 4) {
                wx.showToast({
                    title: '最多 4 人 PLAY 😏',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (this.data.selectUserToPlayList.includes(playerId)) {
                let temp = [...this.data.selectUserToPlayList]
                temp.splice(this.data.selectUserToPlayList.indexOf(playerId), 1)
                this.setData({
                    selectUserToPlayList: [...temp]
                })
            } else {
                this.setData({
                    selectUserToPlayList: [...this.data.selectUserToPlayList, playerId]
                })
            }
            this.setData({
                allPlayers: this.data.allPlayers.map((player: User) => {
                    if (player.id === playerId) {
                        return {...player, selected: !player.selected}
                    } else {
                        return player
                    }
                }),
            })
        },
        // 换人按钮
        startChangePlayers() {
            this.setData({
                changingPlayers: true,
                showButton: false,
            })
        },
        stopChangePlayers() {
            const selectUser = this.data.allPlayers
                .filter((player: User) => (this.data.selectUserToPlayList.includes(player.id)))
                .map((player: User) => ({...player, selected: false}))
            this.setData({
                changingPlayers: false,
                showButton: true,
                winPlayers: [...selectUser],
                losePlayers: [...selectUser],
            })
        }
    }
})