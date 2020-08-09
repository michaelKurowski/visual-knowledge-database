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
  },
  actions: {
      fetchDescendants({ commit }, { nodeId, classificationId }) {
        const baseUrl = `${serverHostPart}${config.backend.endpoints.getDescendants}`
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
