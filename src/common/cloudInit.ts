import CONFIG from '@app/app.config.js'
import store from '@app/store'
//应用初始化页
// #ifdef APP-PLUS
import interceptorChooseImage from '@app/uni_modules/json-interceptor-chooseImage/js_sdk/main.js'
// #endif
const db = uniCloud.database()
export default async function() {
  let loginConfig = CONFIG.router.login
  //清除有配置但设备环境不支持的登陆项
  // #ifdef APP-PLUS
  await new Promise((callBack) => {
    plus.oauth.getServices(
      (oauthServices) => {
        loginConfig = loginConfig.filter((item) => {
          if (['univerify', 'weixin', 'apple'].includes(item)) {
            const index = oauthServices.findIndex((e) => e.id == item)
            if (index == -1) {
              return false
            } else {
              return oauthServices[index].nativeClient
            }
          } else {
            return true
          }
        })
        if (loginConfig.includes('univerify')) {
          //一键登录 功能预登录
          uni.preLogin({
            provider: 'univerify',
            complete: (e) => {
              console.log(e)
            },
          })
        }
        callBack(0)
      },
      (err) => {
        console.error('获取服务供应商失败：' + JSON.stringify(err))
      }
    )
  })
  // #endif

  //非app移除：一键登录、苹果登陆；h5移除微信登陆，如果你做微信公众号登陆需要将此行移除
  // #ifndef APP-PLUS
  loginConfig = loginConfig.filter((item) => {
    return ![
      'univerify',
      'apple',
      // #ifdef H5
      'weixin',
      // #endif
    ].includes(item)
  })
  // #endif

  CONFIG.router.login = loginConfig

  // #ifdef APP-PLUS
  // 实现，路由拦截。当应用无访问摄像头/相册权限，引导跳到设置界面
  interceptorChooseImage()
  // #endif

  //clientDB的错误提示
  function onDBError({
    code, // 错误码详见https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=returnvalue
    message,
  }) {
    console.log('onDBError')
    // 处理错误
    console.log(code, message)
    if (
      [
        'TOKEN_INVALID_INVALID_CLIENTID',
        'TOKEN_INVALID',
        'TOKEN_INVALID_TOKEN_EXPIRED',
        'TOKEN_INVALID_WRONG_TOKEN',
        'TOKEN_INVALID_ANONYMOUS_USER',
      ].includes(code)
    ) {
      uni.navigateTo({
        url: CONFIG.loginPage,
      })
    }
  }
  // 绑定clientDB错误事件
  db.on('error', onDBError)

  // 解绑clientDB错误事件
  //db.off('error', onDBError)
  db.on('refreshToken', function({ token, tokenExpired }) {
    console.log('监听到clientDB的refreshToken', {
      token,
      tokenExpired,
    })
    store.User.token = token
    store.User.tokenExpired = tokenExpired
    uni.setStorageSync('uni_id_token', token)
    uni.setStorageSync('uni_id_token_expired', tokenExpired)
  })

  const Debug = true
  //拦截器封装callFunction
  let callFunctionOption
  uniCloud.addInterceptor('callFunction', {
    async invoke(option) {
      // #ifdef APP-PLUS
      // 判断如果是执行登陆（无论是哪种登陆方式），就记录用户的相关设备id
      if (
        option.name == 'uni-id-cf' &&
        (option.data.action == 'register' || option.data.action.slice(0, 5) == 'login')
      ) {
        const oaid = await new Promise((callBack, fail) => {
          if (uni.getSystemInfoSync().platform == 'android') {
            ;(plus as any).device.getOAID({
              success: (e) => {
                callBack(e.oaid)
                console.log('getOAID success: ' + JSON.stringify(e))
              },
              fail: function(e) {
                callBack(false)
                console.log('getOAID failed: ' + JSON.stringify(e))
              },
            })
          } else {
            callBack(false)
          }
        })

        const imei = await new Promise((callBack, fail) => {
          if (uni.getSystemInfoSync().platform == 'android') {
            ;(plus as any).device.getInfo({
              success: function(e) {
                callBack(e.imei)
                // console.log('getOAID success: '+JSON.stringify(e));
              },
              fail: function(e) {
                callBack(false)
                console.log('getOAID failed: ' + JSON.stringify(e))
              },
            })
          } else {
            callBack(false)
          }
        })

        let push_clientid = ''
        const idfa = plus.storage.getItem('idfa') || '' //idfa有需要的用户在应用首次启动时自己获取存储到storage中

        try {
          push_clientid = plus.push.getClientInfo().clientid
        } catch (e) {
          uni.showModal({
            content: '获取推送标识失败。如果你的应用不需要推送功能，请注释掉本代码块',
            showCancel: false,
            confirmText: '好的',
          })
          console.log(e)
        }

        const deviceInfo = {
          push_clientid, // 获取匿名设备标识符
          imei,
          oaid,
          idfa,
        }
        console.log('重新登陆/注册，获取设备id', deviceInfo)
        option.data.deviceInfo = deviceInfo

        // #ifndef H5
        //注册可能不仅仅走register接口，还有登陆并注册的接口
        option.data.inviteCode = await new Promise((callBack) => {
          uni.getClipboardData({
            success: function(res) {
              if (res.data.slice(0, 18) == 'uniInvitationCode:') {
                const uniInvitationCode = res.data.slice(18, 38)
                console.log('当前用户是其他用户推荐下载的,推荐者的code是：' + uniInvitationCode)
                // uni.showModal({
                // 	content: '当前用户是其他用户推荐下载的,推荐者的code是：'+uniInvitationCode,
                // 	showCancel: false
                // });
                callBack(uniInvitationCode)
                //当前用户是其他用户推荐下载的。这里登记他的推荐者id 为当前用户的myInviteCode。判断如果是注册
              } else {
                callBack(false)
              }
            },
            fail() {
              callBack(false)
            },
          })
        })
        // #endif
      }
      // #endif
      // console.log(JSON.stringify(option));
      callFunctionOption = option
    },
    complete(e) {
      // console.log(JSON.stringify(e));
    },
    fail(e) {
      // 失败回调拦截
      if (Debug) {
        uni.showModal({
          content: '失败' + JSON.stringify(e),
          showCancel: false,
        })
        console.error(e)
      } else {
        uni.showModal({
          content: '系统错误请稍后再试！',
          showCancel: false,
          confirmText: '知道了',
        })
      }
      //如果执行错误，检查是否断网
      uni.getNetworkType({
        complete: (res) => {
          // console.log(res);
          if (res.networkType == 'none') {
            uni.showToast({
              title: '手机网络异常',
              icon: 'none',
            })
            console.log('手机网络异常')
            const callBack = (res) => {
              console.log(res)
              if (res.isConnected) {
                uni.showToast({
                  title: '恢复联网自动重新执行',
                  icon: 'none',
                })
                console.log(res.networkType, '恢复联网自动重新执行')
                uni.offNetworkStatusChange((e) => {
                  console.log('移除监听成功', e)
                })
                //恢复联网自动重新执行
                uniCloud.callFunction(callFunctionOption)
                uni.offNetworkStatusChange(callBack)
              }
            }
            uni.onNetworkStatusChange(callBack)
          }
        },
      })
    },
    success: (e) => {
      const { token, tokenExpired } = e.result
      if (token && tokenExpired) {
        store.User.token = token
        store.User.tokenExpired = tokenExpired
        uni.setStorageSync('uni_id_token', token)
        uni.setStorageSync('uni_id_token_expired', tokenExpired)
      }
      switch (e.result.code) {
        case 401:
          uni.navigateTo({ url: CONFIG.loginPage })
          break
        default:
          uni.showToast({
            title: e.result.message || e.result.msg || e.result.code,
            icon: 'none',
            duration: 2000,
          })
          break
      }
      console.log(e.result)
    },
  })

  setTimeout(() => {
    //自定义路由拦截
    const {
      router: { needLogin, visitor, login },
    } = CONFIG //需要登录的页面
    const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']
    list.forEach((item) => {
      uni.addInterceptor(item, {
        invoke(e) {
          // 调用前拦截
          //获取用户的token
          const token = uni.getStorageSync('uni_id_token')
          //token是否已失效
          const tokenExpired = uni.getStorageSync('uni_id_token_expired') < Date.now()
          //获取要跳转的页面路径（url去掉"?"和"?"后的参数）
          const url = e.url.split('?')[0]
          //获取要前往的页面路径（即url去掉"?"和"?"后的参数）
          const pages = getCurrentPages()
          const fromUrl = pages[pages.length - 1].route

          const inLoginPage = fromUrl.includes('login') || fromUrl.includes('register')

          //控制登录优先级
          if (
            //判断当前窗口是否为登陆页面，如果是则不重定向路由
            url == CONFIG.loginPage &&
            !inLoginPage
          ) {
            //一键登录（univerify）、账号（username）、验证码登录（短信smsCode）
            if (login[0] == 'username') {
              e.url = CONFIG.loginPage
            } else {
              if (e.url == url) {
                e.url += '?'
              } //添加参数之前判断是否带了`？`号如果没有就补上，因为当开发场景本身有参数的情况下是已经带了`？`号
              e.url += 'type=' + login[0]
            }
          } else {
            //拦截强制登录页面
            let pass = true
            //pattern
            if (needLogin) {
              pass = needLogin.every((item) => {
                if (typeof item === 'object' && item.pattern) {
                  return !item.pattern.test(url)
                }
                return url != item
              })
            }
            if (visitor && !inLoginPage) {
              pass = visitor.some((item) => {
                if (typeof item === 'object' && item.pattern) {
                  return item.pattern.test(url)
                }
                return url == item
              })
              console.log({ pass })
            }

            if (!pass && (token == '' || tokenExpired)) {
              uni.showToast({
                title: '请先登录',
                icon: 'none',
              })
              uni.navigateTo({
                url: CONFIG.loginPage,
              })
              return false
            }
          }
          return e
        },
        fail(err) {
          // 失败回调拦截
          console.log(err)
          if (Debug) {
            console.log(err)
            uni.showModal({
              content: JSON.stringify(err),
              showCancel: false,
            })
          }
        },
      })
    })
  }, 5000)
  // #ifdef APP-PLUS
  // 监听并提示设备网络状态变化
  uni.onNetworkStatusChange((res) => {
    console.log(res.isConnected)
    console.log(res.networkType)
    if (res.networkType != 'none') {
      uni.showToast({
        title: '当前网络类型：' + res.networkType,
        icon: 'none',
        duration: 3000,
      })
    } else {
      uni.showToast({
        title: '网络类型：' + res.networkType,
        icon: 'none',
        duration: 3000,
      })
    }
  })
  // #endif
}
