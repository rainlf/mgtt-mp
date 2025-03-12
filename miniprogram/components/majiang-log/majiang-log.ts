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
        },

        // 显示删除确认弹窗
        showDeleteConfirm(e: any) {
            wx.showModal({
                title: '删除确认',
                content: '确定要删除这条对局记录吗？',
                confirmText: "确定",
                cancelText: "再想想",
                success: (res) => {
                    if (res.confirm) {
                        this.deleteRecord(e.currentTarget.dataset.id);
                    }
                }
            });
        },

        // 执行删除操作
        deleteRecord(gameId: number) {
            console.log('deleteRecord', gameId);
            if (!gameId) return;

            // wx.request({
            //     url: 'https://your-api.com/record/delete',
            //     method: 'DELETE',
            //     data: { id: this.data.currentDeleteId },
            //     success: (res) => {
            //         if (res.statusCode === 200) {
            //             this.updateList();
            //             wx.showToast({ title: '删除成功' });
            //         }
            //     },
            //     fail: () => {
            //         wx.showToast({ title: '删除失败', icon: 'none' });
            //     }
            // });
            this.setData({
                listData: this.data.listData.filter(item => (item.id !== gameId)),
            })
        },
    }
})