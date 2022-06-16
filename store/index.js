const actions = {
  async onAuthStateChangedAction(state, { authUser, claims }) {
    console.log('onAuthStateChangedAction - authUser', authUser);

    if (!authUser) {
      state.commit('SET_USER', null)
    } else {
      const { uid, email } = authUser
      state.commit('SET_USER', {
        uid,
        email,
      });
    }
  },

  async nuxtServerInit({ dispatch, commit }, { res }) {
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user
      console.log('nuxtServerInit - authUser', authUser);
      const { uid, email } = authUser

      await dispatch('onAuthStateChangedAction', {
        authUser,
        claims,
        token
      });
    }
  }
}
const state = () => ({
  user: null,
})

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TO_FROM(route, to_from) {
    route.to = to_from[0];
    route.from = to_from[1];
  }
}

export const routeStore = () => ({
   routes: new Array(),
})

export const route = () => ({
  to: null,
  from: null
})

const getters = {
  getUser(state) {
    return state.user
  },
  isLoggedIn(state) {
    let userLoggedIn = false
    if (state.user) {
      userLoggedIn = true
    }
    return userLoggedIn
  },
  getRoutes(){
    return routeStore()
  },
  getRouteInfo() {
    return route();
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
  route,
}

