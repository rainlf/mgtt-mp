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
    observers: {
        'showDrawer': function (val) {
            if (val) {
                this.loadData()
            }
        }
    },
    methods: {
        // load data
        loadData() {
            getMajiangPlayers().then((res) => {
                const currentIds = res.currentPlayers.map((player: User) => (player.id))
                this.setData({
                    winPlayers: res.currentPlayers.map((player: User, index: number) => ({
                        ...player,
                        selected: index === 0,
                        lastSelected: index === 0,
                        gameInfo: {basePoints: 0, winTypes: [], multi: 1},
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

        // 清空
        handleDelete(e: any) {
            const userId = e.currentTarget.dataset.id;
            console.log('handleDelete', userId);
            this.setData({
                winPlayers: this.data.winPlayers.map((player: User) => {
                    if (player.id === userId) {
                        return {...player, gameInfo: {basePoints: 0, winTypes: [], multi: 1}};
                    } else {
                        return player
                    }
                }),
                // 底分全部反选
                points: this.data.points.map((point: any) => ({...point, selected: false})),
                // 牌型全部反选
                winTypes: this.data.winTypes.map((winType: any) => ({...winType, selected: false})),
            })
        },

        // 底分
        selectBasePoints(e: any) {
            const name = e.currentTarget.dataset.name;
            const selected = e.currentTarget.dataset.selected;
            const point = e.currentTarget.dataset.point;
            const userId = e.currentTarget.dataset.userid;
            console.log('selectBasePoints', name, selected, point, userId);
            console.log('selectBasePoints2', e.currentTarget.dataset);

            this.setData({
                points: this.data.points.map((point: any) => {
                    if (point.name === name) {
                        return {...point, selected: true};
                    } else {
                        return {...point, selected: false};
                    }
                }),
                winPlayers: this.data.winPlayers.map((user: User) => {
                    if (user.id === userId) {
                        return {...user, gameInfo: {...user.gameInfo, basePoints: point}}
                    } else {
                        return user
                    }
                })
            })
        },
        handleDecrease(e: any) {
            const userId = e.currentTarget.dataset.userid;
            console.log('handleDecrease', userId);

            const user = this.data.winPlayers.filter(x => x.id === userId)[0]
            const target = user.gameInfo.basePoints - 1
            if (target < 0) {
                wx.showToast({
                    title: '底分不能小于 0 呀 😏',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            this.setData({
                winPlayers: this.data.winPlayers.map((player: User) => {
                    if (player.id === userId) {
                        return {...player, gameInfo: {...player.gameInfo, basePoints: target}};
                    } else {
                        return player
                    }
                })
            })
        },
        handleIncrease(e: any) {
            const userId = e.currentTarget.dataset.userid;
            console.log('handleIncrease', userId);

            const user = this.data.winPlayers.filter(x => x.id === userId)[0]
            const target = user.gameInfo.basePoints + 1
            if (target > 20) {
                wx.showToast({
                    title: '底分是不是太大了呀 😏',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            this.setData({
                winPlayers: this.data.winPlayers.map((player: User) => {
                    if (player.id === userId) {
                        return {...player, gameInfo: {...player.gameInfo, basePoints: target}};
                    } else {
                        return player
                    }
                })
            })
        },

        // 翻倍牌型
        toggleWinType(e: any) {
            const name = e.currentTarget.dataset.name;
            const multi = e.currentTarget.dataset.multi;
            const selected = e.currentTarget.dataset.selected;
            const userId = e.currentTarget.dataset.userid;
            console.log('toggleWinType', name, multi, selected, userId);

            this.setData({
                winTypes: this.data.winTypes.map((type: any) => {
                    if (type.name === name) {
                        return {...type, selected: !type.selected}
                    } else {
                        return type
                    }
                }),
                winPlayers: this.data.winPlayers.map((player: User) => {
                    if (player.id === userId) {
                        let totalMulti = player.gameInfo.multi
                        let totalWinTypes = player.gameInfo.winTypes
                        if (selected) {
                            // 取消点击
                            totalMulti /= multi
                            totalWinTypes = totalWinTypes.filter(x => x !== name)
                        } else {
                            // 点击
                            totalMulti *= multi
                            totalWinTypes = [...totalWinTypes, name]
                        }
                        return {...player, gameInfo: {...player.gameInfo, winTypes: totalWinTypes, multi: totalMulti}}
                    } else {
                        return player
                    }
                })
            })
        },

        // 选择胡牌类型
        selectWinType(e: any) {
            const type = e.currentTarget.dataset.type;
            this.setData({
                gameType: type,
                // 全部用户积分配置清零
                winPlayers: this.data.winPlayers.map((player: User) => {
                    return {...player, gameInfo: {basePoints: 0, winTypes: [], multi: 1}}
                }),
                // 底分全部反选
                points: this.data.points.map((point: any) => ({...point, selected: false})),
                // 牌型全部反选
                winTypes: this.data.winTypes.map((winType: any) => ({...winType, selected: false})),
            });
        },

        // 选择赢家
        selectWinPlayer(e: any) {
            const playerId = e.currentTarget.dataset.id;
            const selected = e.currentTarget.dataset.selected;
            const lastSelected = e.currentTarget.dataset.lastselected;
            console.log('rain, selectWinPlayer', playerId, selected, lastSelected);

            if (this.data.gameType === '多赢家') {
                // 一炮多响
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
                    // 底分全部反选
                    points: this.data.points.map((point: any) => ({...point, selected: false})),
                    // 牌型全部反选
                    winTypes: this.data.winTypes.map((winType: any) => ({...winType, selected: false})),
                })
            } else {
                // 平胡，自摸
                this.setData({
                    winPlayers: this.data.winPlayers.map((player: User) => {
                        if (player.id === playerId) {
                            return {...player, selected: !player.selected, lastSelected: true}
                        } else {
                            // 反选其他，并清空分数配置
                            return {
                                ...player,
                                selected: false,
                                lastSelected: false,
                                gameInfo: {basePoints: 0, winTypes: [], multi: 1}
                            }
                        }
                    }),
                    // 底分全部反选
                    points: this.data.points.map((point: any) => ({...point, selected: false})),
                    // 牌型全部反选
                    winTypes: this.data.winTypes.map((winType: any) => ({...winType, selected: false})),
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
                winPlayers: selectUser.map((player: User) => ({
                    ...player,
                    gameInfo: {basePoints: 0, winTypes: [], multi: 1}
                })),
                losePlayers: [...selectUser],
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
    }
})