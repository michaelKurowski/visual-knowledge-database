import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            nodesList: 'tree/nodesList'
        })
    },
    created() {
        this.fetchTreeRoot({classificationId: 'BRANCHES'})
    },
    mounted() {

    },
    methods: {
        ...mapActions({
            fetchTreeRoot: 'tree/fetchTreeRoot'
        })
    },
    metaInfo: {
        meta: [
            { name: 'viewport', content:'width=device-width, initial-scale=-1.5, user-scalable=no' }
        ]
    },
    
}