function loadingWrap (Vue) {
  if (loadingWrap.installed) {
    return
  }

  !Vue.prototype.$loading && Object.defineProperties(Vue.prototype, {
    $loading: {
      get () {
        const { $store } = this
        return {
          show () {
            console.log('this.$store', $store)
            $store.commit('TOGGLE_LOADING', true)
          },
          hide () {
            console.log('this.$store', $store)
            $store.commit('TOGGLE_LOADING', false)
          }
        }
      }
    }
  })
}

export default loadingWrap
