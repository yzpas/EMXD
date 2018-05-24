//index.js
//获取应用实例
const app = getApp()
const home = app.globalData.host + "/home/index" // 首页接口
const homeSearch = app.globalData.host + "/home/search" // 首页接口  
// var countdown = 0;
// var settime = function (that,test) {
//   if( test == 1 ){
//     that.getHomeInfo();
//   }else{
//     setTimeout(function () {
//       // settime(that)
//       that.appApi();
//     }, 500)
//   }
  
// }
Page({
  data: {
    recently_shop_list:[], // 最近使用
    follow_shop_list:[], // A-Z店铺
    toView: '',
    getSystemInfo: [], //获取手机信息
    Search:[],// 搜索
    userInfo: {},
    albumDisabled: true,
    bindDisabled: false,
    keywords:'',
    // hasUserInfo: false,
    // userInfo:{},
    // searchval:'',
  },
  
  onLoad: function (options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true
    })
    // console.log(options.identifying)
    // if (options.identifying == 'yes') {
    //   app.globalData.ShareAppMessage = false;
    // }
    let that = this;
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
      console.log('没有token')
    }else{
      console.log('有token')
      that.getHomeInfo();
    } 
    
    // 获取手机信息以及屏幕大小
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          getSystemInfo: res
        })
      }
    });
    // that.getHomeInfo();
    // that.appApi();
  },
  // 扫码进入
  RichScan: function (options){
    let that = this;
    wx.scanCode({
      scanType:'qrCode',
      success: (res) => {
        console.log('扫码进来')
        console.log(res)
        console.log(decodeURIComponent(res.scene))

        if (res.path) {
          wx.navigateTo({
            url: '../../' + res.path + '&identifying=no'
          })      
        }else{
          wx.showToast({
            title: '请扫描商户二维码',
            icon: 'none',
            mask: true
          })
        }
        //  + res.scanType + res.charSet + res.path
      }
    })
  },
  // appApi:function(){
  //   let that = this;
  //   // settime(that,)
  //   if (wx.getStorageSync('token')){
  //     settime(that, 1)
  //   }else{
  //     settime(that, 2)
  //   }
  // },
  // 调取接口 获得首页信息
  getHomeInfo(){
    let that = this;
    
    console.log(app.globalData.code)
    // 调取接口
    app.getRequest(home, {}, function (res) {
      if (res.data.code == 0){
        console.log(res.data.res.follow_shop_list);
        that.setData({
          Search:[],
          recently_shop_list: res.data.res.recently_shop_list,
          follow_shop_list: res.data.res.follow_shop_list
        })
        console.log('首页数据获取完成')
        wx.hideToast()
      } else if (res.data.code == -100 ){
        wx.showToast({
          title: '用户登录过期,请重新获取信息授权!',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/index/index?parameter=index'
          })
        }, 2000)
        return;
        // wx.login({
        //   success: function (resCode) {
        //     wx.getUserInfo({
        //       withCredentials: true,
        //       success: function (res_user) {
        //         wx.request({
        //           url: app.globalData.host+'/users/login',
        //           data: {
        //             code: resCode.code,
        //             encryptedData: res_user.encryptedData,
        //             iv: res_user.iv
        //           },
        //           method: 'GET',
        //           header: {
        //             'content-type': 'application/json'
        //           },
        //           success: function (res) {
        //             wx.setStorageSync('token', res.data.token);
        //             that.getHomeInfo();
        //           }
        //         })
        //       }
        //     })
        //   }
        // })
      }else{
        wx.showToast({
          title: '网络错误请稍后再试...',
          icon: 'none',
          mask: true
        })
      }
    },'hint')
  },
  bindKeyInput:function(e){
    let that = this;
    this.setData({
      keywords: e.detail.value
    })
    if (e.detail.value === ''){
      that.getHomeInfo();
    }
  },
  search:function(){
    let that = this;
    that.homeSearch();
  },
  // 搜索
  homeSearch:function(){
    let that = this;
    let keywords = that.data.keywords;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true
    })
    if (!keywords){
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none',
        mask: true
      })
      return;
    }
      // 调取接口
      app.getRequest(homeSearch, { keywords: keywords }, function (res) {
        if (res.data.code == 0) {
          console.log(res);
          wx.hideToast()
          if (!res.data.res){
            wx.showToast({
              title: '未搜索到本店铺',
              icon: 'none',
              mask: true
            })
          }
          that.setData({
            Search: res.data.res
          })
        } else {
          wx.showToast({
            title: '网络错误请稍后再试...',
            icon: 'none',
            mask: true
          })
        }
      }, 'hint')
    
    
  },
  // 店铺
  shopST: function (e) {
    let ids = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    app.globalData.shopCart.merchantName = name;
    // app.globalData.shopCart.menu_list = [];
    // app.globalData.shopCart.total_fee = 0;
    // app.globalData.shopCart.shopNumber = 0;
    app.clearCart();
    wx.navigateTo({
      url: '/pages/Individual/Individual?id='+ids
    })
  },
  // 锚点
  anchor:function(e){
    let that = this;
    let target = e.currentTarget.dataset.anchor;
    console.log(target);
    this.setData({
      toView: target
    })
  },
 
  onShow:function(){
    let that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true
    })
    if (wx.getStorageSync('token')) {
      that.getHomeInfo();
    }else{
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '鹅毛小店，欢迎选购',
      path: '/pages/indexTo/indexTo?identifying=no'
    }
  }
})
