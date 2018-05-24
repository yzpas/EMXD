//index.js
//获取应用实例
const app = getApp()
var settime = function (that, test) {
  if (test == 1) {
    // that.getUserInfo();
  } else {
    setTimeout(function () {
      // settime(that)
      that.appApi();
    }, 1000)
  }

}
Page({
  data: {
    // recently_shop_list: [], // 最近使用
    // follow_shop_list: [], // A-Z店铺
    // toView: '',
    // getSystemInfo: [], //获取手机信息
    // Search: [],// 搜索
    // userInfo: {},
    // albumDisabled: true,
    // bindDisabled: false,
    // keywords: '',
    // hasUserInfo: false,
    // userInfo: {},
    // searchval:'',
    parameter: '',
    id:'',
    isLoaded: false
  },

  onLoad: function (options) {

    wx.login({
      success: function (res) {
        app.globalData.code = res.code;
      }
    });
    let that = this;
    that.appApi();
    that.setData({
      parameter: options.parameter,
      id: options.id,
      isLoaded: true
    })
  },

  onShow: function () {
    let that = this;
    if (that.data.isLoaded == false) {
      wx.login({
        success: function (res) {
          app.globalData.code = res.code;
        }
      });
      
      that.appApi();
      that.setData({
        parameter: options.parameter,
        id: options.id,
      })
    }
  },
  appApi: function () {
    let that = this;
    // settime(that,)
    if (wx.getStorageSync('token')) {
      settime(that, 1)
      wx.switchTab({
        url: '/pages/indexTo/indexTo'
      })
    } else {
      settime(that, 2)
    }
  },
  getUserInfo: function (e) {
    let that = this;
    console.log(e)
    wx.showToast({
      title: '正在登陆',
      icon: 'loading',
      mask: true
    })
    // if (e.target.dataset.errMsg){
    app.globalData.userInfo = e.detail.userInfo
    console.log('users4');
    wx.login({      
      success: function (res) {
        console.log(res);
        app.globalData.code = res.code;
        let data = {
          code: res.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
        if (res.code && e.detail.iv) {
          wx.request({
            //后台接口地址
            url: 'https://prd-shop-api.emaoxd.com/users/login',
            data: app.jsonToString(data),
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log('请求了网络');
              // if (e.detail.iv && res.data)
              if (res.data) {
                app.globalData.userInfo = res.data;
                app.globalData.token = res.data.token
                wx.setStorageSync("token", res.data.token)
                if (wx.getStorageSync('token')) {
                  wx.hideToast()
                }
                console.log(that.data.parameter)
                if (that.data.parameter === 'index') {
                  wx.switchTab({
                    url: '/pages/indexTo/indexTo'
                  })
                }
                if (that.data.parameter === 'ininterval') {
                  wx.switchTab({
                    url: '/pages/interval/interval?id='+that.data.id
                  })
                }
                if (that.data.parameter === 'product') {
                  wx.switchTab({
                    url: '/pages/productDetails/productDetails?id=' + that.data.id
                  })
                }
                if (that.data.parameter === 'order') {
                  wx.switchTab({
                    url: '/pages/order/order'
                  })
                }
                if (that.data.parameter === 'logs') {
                  wx.switchTab({
                    url: '/pages/logs/logs'
                  })
                }
                if (that.data.parameter === 'yes') {
                  wx.navigateBack({
                    delta: 1
                  })
                }
                if (!wx.getStorageSync('token')) {
                  wx.showToast({
                    title: '登录失败请重新登录',
                    icon: 'none',
                    mask: true
                  })
                  return;
                }
                if (!that.data.parameter) {
                  wx.switchTab({
                    url: '/pages/indexTo/indexTo'
                  })
                }
                // that.getUserInfo();
              } else if (e.detail.iv && !res.data) {
                wx.request({
                  //后台接口地址
                  url: 'https://prd-shop-api.emaoxd.com/users/login',
                  data: app.jsonToString(data),
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log('请求了网络');
                    // if (e.detail.iv && res.data)
                    if (res.data) {
                      app.globalData.userInfo = res.data;
                      app.globalData.token = res.data.token
                      wx.setStorageSync("token", res.data.token)
                      if (wx.getStorageSync('token')) {
                        wx.hideToast()
                      }
                      console.log(that.data.parameter)
                      if (that.data.parameter === 'index') {
                        wx.switchTab({
                          url: '/pages/indexTo/indexTo'
                        })
                      }
                      if (that.data.parameter === 'ininterval') {
                        wx.switchTab({
                          url: '/pages/interval/interval?id='+that.data.id
                        })
                      }
                      if (that.data.parameter === 'order') {
                        wx.switchTab({
                          url: '/pages/order/order'
                        })
                      }
                      if (that.data.parameter === 'logs') {
                        wx.switchTab({
                          url: '/pages/logs/logs'
                        })
                      }
                      if (that.data.parameter === 'yes') {
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                      // if (!wx.getStorageSync('token')) {
                      //   wx.showToast({
                      //     title: '登录失败请重新登录',
                      //     icon: 'none',
                      //     mask: true
                      //   })
                      //   return;
                      // }
                      if (!that.data.parameter) {
                        wx.switchTab({
                          url: '/pages/indexTo/indexTo'
                        })
                      }
                      // that.getUserInfo();
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '登录失败请重新登录',
                  icon: 'none',
                  mask: true
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '登录失败请重新登录',
            icon: 'none',
            mask: true
          })
        }
      }
    })

    // }else{
    //   this.setData({
    //     userInfo: e.detail.userInfo,
    //     hasUserInfo: true
    //   })
    // }
  },
  // onShow: function () {
  //   let that = this;
  //   if (wx.getStorageSync('token')) {
  //     wx.switchTab({
  //       url: '/pages/indexTo/indexTo'
  //     })
  //   }
  // }
})
