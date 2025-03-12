Component({
    properties: {
        showDrawer: {
            type: Boolean,
            value: true
        }
    },

    data: {
        winType: '平胡' // 默认选中平胡
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
        }
    }
})