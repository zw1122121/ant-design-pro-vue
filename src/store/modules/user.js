import Vue from 'vue'
import { login, getInfo, logout, getRole, getPermission } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import axios from 'axios'
import { smEncrypt, smSign, smDecrypt, smVerify, generatorUUID } from '@/utils/encrypt'
import notification from 'ant-design-vue/es/notification'

const user = {
  state: {
    token: '',
    privateKey: '',
    publicServerKey: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_KEY: (state, { privateKey, publicServerKey }) => {
      state.privateKey = privateKey
      state.publicServerKey = publicServerKey
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        let checkTimes = 0
        const doLogin = () => {
          login(userInfo).then(response => {
            const result = response
            Vue.ls.set(ACCESS_TOKEN, result.token, 30 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_KEY', { privateKey: result.private_key, publicServerKey: result.public_server_key })

            const random = generatorUUID()
            const param = { message: 'checkKey', name: 'checkKey' }
            const params = {
              data: smEncrypt(JSON.stringify(param), this.state.user.publicServerKey),
              sign: smSign(random, this.state.user.privateKey),
              random: smEncrypt(random)
            }
            axios.post('/checkKey', params, {
              headers: { 'Authorization': result.token }
            }).then(r => {
              const data = r.data
              const msg = smDecrypt(data.data, this.state.user.privateKey)
              const random = smDecrypt(data.random, this.state.user.privateKey)
              if (!smVerify(random, data.sign, this.state.user.publicServerKey)) {
                console.log('sign invalid data is ->' + msg)
                notification.error({
                  message: '错误',
                  description: '获取的数据未通过签名校验！'
                })
              } else {
                console.log('sign ok data is -> ' + msg)
              }
              resolve()
            }).catch((error) => {
              checkTimes++
              if (checkTimes < 5) {
                doLogin()
              } else {
                notification.error({
                  message: '错误',
                  description: '超过最大密钥申请次数！'
                })
                reject(error)
              }
            })
          }).catch(error => {
            reject(error)
          })
        }
        doLogin()
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    authTest ({ commit }) {
      getRole().then(data => {
        console.info(data)
      })
      getPermission().then(data => {
        console.info(data)
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
