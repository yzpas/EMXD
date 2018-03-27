//app.js
App({
  onLaunch: function (options) {
    console.log(options);
    // 展示本地存储能力 
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {   
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //注册页面时加载loading
  loading: function () {
    wx.showToast({
      title: '加载中...',
      image: '/pages/images/loading.gif',
      icon: 'loading',
      mask: true,
      duration: 1000
    })
  },
  // get请求
  getRequest: function (url, data, succ, status) {
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        succ && succ(res);
      },
      fail: function (res) {
        fail && fail(res);
      },
      complete: function () {
        if (!status) {
          wx.hideToast();
        }
      }
    })
  },

  // post请求
  postRequest: function (url, data, succ, status) {
    wx.request({
      url: url,
      data: data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        succ && succ(res);
      },
      fail: function (res) {
        fail && fail(res);
      },
      complete: function () {
        if (!status) {
          wx.hideToast();
        }
      }
    })
  },
  onShow: function (options) {
    // Do something when show.
  },
  onHide: function () {
    // Do something when hide.
  },
  onError: function (msg) {
    //console.log(msg)
  },
  globalData: {
    userInfo: null
  }
})