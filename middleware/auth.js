export default function ({ store, app, route, redirect }) {
  const user = store.state.user;
  console.log('from middleware', user)

  if (route.path === '/auth/login' || route.path === '/auth/signup' || route.path === '/profilecreation') {
    if (user) {
      return redirect('/profilepage')
    }
  }

  if (route.path !== '/auth/login' && route.path !== '/auth/signup') {
    if (!user) {
      return redirect('/auth/session')
    }
  }

}
