import login from './auth'

export default {
  bindAll: (app) => {
      login(app)
    }
}
