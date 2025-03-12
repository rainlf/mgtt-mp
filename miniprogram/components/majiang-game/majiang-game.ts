import {getMajiangPlayers} from "../../services/majiang-service";

Component({
    properties: {
        showDrawer: {
            type: Boolean,
            value: true
        }
    },
    data: {
        winType: '平胡', // 默认选中平胡
        activePlayer: null,
        detailBoxStyle: '',

        players: [] as User[],
        allPlayers: [] as User[],
        changingPlayers: false,
        selectUserToPlayList: [] as number[],
        showButton: true,
    },
    lifetimes: {
        attached() {
            console.log('attached');
            getMajiangPlayers().then((res) => {
                const currentIds = res.currentPlayers.map((player: User) => (player.id))

                this.setData({
                    players: res.currentPlayers.map((player: User) => ({...player, selected: false})),
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
            console.log('selectWinType')
            const type = e.currentTarget.dataset.type;
            this.setData({winType: type});
            console.log('selectWinType, type', type);
        },
        // 选择玩家
        selectPlayer(e: any) {
            const playerId = e.currentTarget.dataset.id;
            const selected = e.currentTarget.dataset.selected;
            console.log('rain, selectPlayer', playerId, selected);
            this.setData({
                players: this.data.players.map((player: User) => {
                    if (player.id === playerId) {
                        return {...player, selected: !player.selected}
                    } else {
                        return player;
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
            this.setData({
                changingPlayers: false,
                showButton: true,
                players: this.data.allPlayers
                    .filter((player: User) => (this.data.selectUserToPlayList.includes(player.id)))
                    .map((player: User) => ({...player, selected: false}))
            })
        }
    }
})