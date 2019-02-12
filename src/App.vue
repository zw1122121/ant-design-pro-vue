<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <a-spin :spinning="globalLoading" wrapperClassName="top-loading">
        <router-view />
      </a-spin>
    </div>
  </a-locale-provider>
</template>

<script>
import { mapState } from 'vuex'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'

export default {
  data () {
    return {
      locale: zhCN
    }
  },
  computed: {
    ...mapState({
      globalLoading: state => state.app.globalLoading
    })
  },
  mounted () {
    console.log(this.globalLoading)
    this.$loading.show()
    setTimeout(() => {
      this.$loading.hide()
    }, 3000)
    const { $store } = this
    deviceEnquire(deviceType => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          $store.commit('TOGGLE_DEVICE', 'desktop')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.TABLET:
          $store.commit('TOGGLE_DEVICE', 'tablet')
          $store.dispatch('setSidebar', false)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          $store.commit('TOGGLE_DEVICE', 'mobile')
          $store.dispatch('setSidebar', true)
          break
      }
      console.log('deviceType', deviceType)
    })
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
  #app .top-loading {
    height: 100%;
  }
  #app .top-loading .ant-spin-container {
    height: 100%;
  }
</style>
