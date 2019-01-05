import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'
import PermissionHelper from '@/utils/helper/permission'
import '@/components/use'

Vue.use(VueStorage, config.storageOptions)
Vue.use(PermissionHelper)