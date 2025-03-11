Component({
    properties: {
        listData: {
            type: Array,
            value: []
        },
    },
    data: {
        isRefreshing: false,
        isLoading: false
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
            // const user = await getUserInfo(this.data.user.id)
            // console.log('loadData', user)
            // this.setData({user});
        }
    }
})