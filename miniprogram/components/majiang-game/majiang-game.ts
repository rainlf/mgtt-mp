Component({
    properties: {
        showDrawer: {
            type: Boolean,
            value: true
        }
    },

    methods: {
        closeDrawer() {
            console.log('close drawer')
            this.setData({ showDrawer: false })

        },

        submit() {
            console.log('submit')
            this.setData({ showDrawer: false })
        }
    }
})