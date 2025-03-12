Component({
    properties: {
        listData: {
            type: Array,
            value: []
        },
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