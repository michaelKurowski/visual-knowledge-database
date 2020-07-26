export default {
    name: 'TopBar',
    data() {
        return {
            dropped: false
        }
    },
    computed: {
        currentPath() {
            return this.$router.history.current.path
        }
    },
    methods: {
        toggle() {
            this.dropped = !this.dropped
        }
    }
}