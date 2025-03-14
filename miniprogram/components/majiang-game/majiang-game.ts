import {getMajiangPlayers, saveMaJiangGame} from "../../services/majiang-service";

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
            {name: '一条龙', multi: 2, selected: false},
            {name: '大吊车', multi: 2, selected: false},
            {name: '碰碰胡', multi: 2, selected: false},
            {name: '门前清', multi: 2, selected: false},
            {name: '混一色', multi: 2, selected: false},
            {name: '清一色', multi: 4, selected: false},
            {name: '小七对', multi: 2, selected: false},
            {name: '龙七对', multi: 4, selected: false},
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
            if (this.data.gameType === '多赢家') {
                // 一炮多响
                this.setData({
                    winPlayers: this.data.winPlayers.map((player: User) => {
                        if (player.id === userId) {
                            return {...player, selected: false, gameInfo: {basePoints: 0, winTypes: [], multi: 1}};
                        } else {
                            return player
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
            }

        },

        // 底分
        selectBasePoints(e: any) {
            const name = e.currentTarget.dataset.name;
            // const selected = e.currentTarget.dataset.selected;
            const point = e.currentTarget.dataset.point;
            const userId = e.currentTarget.dataset.userid;

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
                        return {...user, selected: true, gameInfo: {...user.gameInfo, basePoints: point}}
                    } else {
                        return user
                    }
                })
            })
        },
        handleDecrease(e: any) {
            const userId = e.currentTarget.dataset.userid;

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
                        return {...player, selected: true, gameInfo: {...player.gameInfo, basePoints: target}};
                    } else {
                        return player
                    }
                }),
                points: this.data.points.map((point: any) => ({...point, selected: point.point === target})),
            })
        },
        handleIncrease(e: any) {
            const userId = e.currentTarget.dataset.userid;
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
                        return {...player, selected: true, gameInfo: {...player.gameInfo, basePoints: target}};
                    } else {
                        return player
                    }
                }),
                points: this.data.points.map((point: any) => ({...point, selected: point.point === target})),
            })
        },

        // 翻倍牌型
        toggleWinType(e: any) {
            const name = e.currentTarget.dataset.name;
            const multi = e.currentTarget.dataset.multi;
            const selected = e.currentTarget.dataset.selected;
            const userId = e.currentTarget.dataset.userid;

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
                        return {
                            ...player,
                            selected: true,
                            gameInfo: {...player.gameInfo, winTypes: totalWinTypes, multi: totalMulti}
                        }
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
                winPlayers: this.data.winPlayers.map((player: User, index: number) => {
                    return {
                        ...player,
                        selected: index === 0,
                        lastSelected: index === 0,
                        gameInfo: {basePoints: 0, winTypes: [], multi: 1}
                    }
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

            this.setData({
                losePlayers: this.data.winPlayers.map((player: User) => ({...player, selected: false}))
            })

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
                            return {...player, selected: true, lastSelected: true}
                        } else {
                            return {...player, lastSelected: false};
                        }
                    }),

                })
                if (!lastSelected) {
                    const user = this.data.winPlayers.filter(x => x.id === playerId)[0]
                    const targetPoints = user.gameInfo.basePoints
                    const targetWinTypes = user.gameInfo.winTypes
                    this.setData({
                        // 底分全部反选
                        points: this.data.points.map((point: any) => ({
                            ...point,
                            selected: point.point === targetPoints
                        })),
                        // 牌型全部反选
                        winTypes: this.data.winTypes.map((winType: any) => ({
                            ...winType,
                            selected: targetWinTypes.includes(winType.name)
                        })),
                    })
                }
            } else {
                // 平胡，自摸
                this.setData({
                    winPlayers: this.data.winPlayers.map((player: User) => {
                        if (player.id === playerId) {
                            return {...player, selected: true, lastSelected: true}
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
                })
                if (!lastSelected) {
                    this.setData({
                        points: this.data.points.map((point: any) => ({...point, selected: false})),
                        // 牌型全部反选
                        winTypes: this.data.winTypes.map((winType: any) => ({...winType, selected: false})),
                    })
                }
            }
        },
        selectLosePlayer(e: any) {
            const playerId = e.currentTarget.dataset.id;

            const winIds = this.data.winPlayers.filter((player: User) => player.selected).map((player: User) => player.id)
            if (winIds.includes(playerId)) {
                return;
            }

            this.setData({
                losePlayers: this.data.losePlayers.map((player: User) => {
                    if (player.id === playerId) {
                        return {...player, selected: true}
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
            if (selectUser.length != 4) {
                wx.showToast({
                    title: '游戏需要 4 名玩家哦 😏',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            this.setData({
                changingPlayers: false,
                showButton: true,
                winPlayers: selectUser.map((player: User, index: number) => ({
                    ...player,
                    selected: index === 0,
                    lastSelected: index === 0,
                    gameInfo: {basePoints: 0, winTypes: [], multi: 1}
                })),
                losePlayers: [...selectUser],
            })
        },

        closeDrawer() {
            this.setData({
                showDrawer: false,
                // 底分全部反选
                points: this.data.points.map((point: any) => ({...point, selected: false})),
                // 牌型全部反选
                winTypes: this.data.winTypes.map((winType: any) => ({...winType, selected: false})),
            })
        },

        showSubmit() {
            let winners = this.data.winPlayers.filter((player: User) => {
                return player.selected
            })
            let losers = this.data.losePlayers.filter((player: User) => {
                return player.selected
            })

            let exit = false
            winners.forEach((player: User) => {
                if (player.gameInfo.basePoints <= 0) {
                    exit = true
                }
            })
            if (exit) {
                wx.showToast({
                    title: '赢家得分必须大于 0 哦 🍑',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }

            if (this.data.gameType === '平胡') {
                if (winners.length != 1) {
                    wx.showToast({
                        title: '请选择一个赢家 🥕',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
                if (losers.length != 1) {
                    wx.showToast({
                        title: '请选择一个输家 🍌',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
            } else if (this.data.gameType === '自摸') {
                if (winners.length != 1) {
                    wx.showToast({
                        title: '请选择一个赢家 🥕',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
                losers = this.data.losePlayers.filter((player: User) => {
                    return player.id !== winners[0].id
                })
            } else if (this.data.gameType === '多赢家') {
                if (winners.length < 1) {
                    wx.showToast({
                        title: '请至少选择一个赢家 🥕',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
                if (losers.length != 1) {
                    wx.showToast({
                        title: '请选择一个输家 🍌',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
            }


            let gameType = 1
            if (this.data.gameType === '平胡') {
                gameType = 1
            } else if (this.data.gameType === '自摸') {
                gameType = 2
            } else if (this.data.gameType === '多赢家') {
                if (winners.length === 2) {
                    // 一炮双响
                    gameType = 3
                } else if (winners.length === 3) {
                    // 一炮三响
                    gameType = 4
                }
            }

            this.submit(gameType, winners, losers)
            // wx.showModal({
            //     title: '提交确认',
            //     content: '确定要提交这次对局记录吗？',
            //     confirmText: "确定",
            //     cancelText: "记错了",
            //     success: (res) => {
            //         if (res.confirm) {
            //             this.submit(gameType, winners, losers)
            //         }
            //     }
            // });
        },

        submit(gameType: number, winners: User[], losers: User[]) {
            const data = {
                gameType: gameType,
                players: this.data.winPlayers.map((player: User) => (player.id)),
                recorderId: wx.getStorageSync('user').id,
                winners: winners.map((player: User) => ({
                    userId: player.id,
                    basePoints: player.gameInfo.basePoints,
                    winTypes: player.gameInfo.winTypes,
                })),
                losers: losers.map((player: User) => player.id),
            }
            console.log('submit', data)
            saveMaJiangGame(data).then(() => {
                this.closeDrawer()
            })
        }
    }
})