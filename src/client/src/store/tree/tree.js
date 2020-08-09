import config from '@/config.json'

const serverHostPart = `${config.backend.protocol}://${config.backend.host}`

export default {
  namespaced: true,
  state() {
      return {
          nodesList: []
      }
  },
  mutations: {
      addNodes(state, listOfNodes) {
        state.nodesList.push(listOfNodes)
      }
  },
  actions: {
      fetchDescendants({ commit }, { nodeId, classificationId }) {
        const baseUrl = `${serverHostPart}${config.backend.endpoints.getDescendants}`
        return fetch(`${baseUrl}?nodeId=${nodeId}&classificationId=${classificationId}`)
            .then(response => {
                commit('addNodes', response.nodes)
            })
      },
      fetchAncestors({ commit }, { nodeId, classificationId }) {
        const baseUrl = `${serverHostPart}${config.backend.endpoints.getAncestors}`
        return fetch(`${baseUrl}?nodeId=${nodeId}&classificationId=${classificationId}`)
            .then(response => {
                commit('addNodes', response.nodes)
            })
      },
      fetchTreeRoot({ commit }, { classificationId }) {
        const baseUrl = `${serverHostPart}${config.backend.endpoints.getRoot}`
        return fetch(`${baseUrl}?classificationId=${classificationId}`)
            .then(response => {
                commit('addNodes', response.nodes)
            })
      }
  },
  getters: {

  }
}
