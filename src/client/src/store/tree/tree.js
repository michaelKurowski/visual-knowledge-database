import config from '@config'

const serverHostPart = `${config.server.protocol}://${config.server.host}`

export default {
  namespaced: true,
  state() {
      return {
          nodesList: []
      }
  },
  mutations: {
  },
  actions: {
      fetchDescendants({ commit }, { nodeId, classificationId }) {
        const baseUrl = `${serverHostPart}${config.server.endpoints.getDescendants}`
        return fetch(`${baseUrl}?nodeId=${nodeId}&classificationId=${classificationId}`)
      },
      fetchAncestors() {

      },
      fetchTreeRoot() {

      }
  },
  getters: {

  }
}
