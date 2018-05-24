//logs.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
const users = app.globalData.host + "/users/home" // 我的接口
Page({
  data: {
    logs: [],
    token:'',
    isToken:false,
  },
  onLoad: function () {
    console.log('users1');
    let that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.users()
        that.setData({
          token: res.data
        })
      }
    });
    if (wx.getStorageSync('token')) {
      this.setData({
        isToken: true
      })
    } 
    // let token = app.globalData.userInfo.token;
   
  },
  users: function (token){
    console.log('users3');
    let that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask:true
    })
    // 调取接口
    app.getRequest(users, {}, function (res) {
      if (res.data.code == 0) {
        wx.hideToast()
        that.setData({
          logs:res.data.res
        })
        
      } else if (res.data.code == -100) {
        wx.showToast({
          title: '用户登录过期,请重新获取信息授权!',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/index/index?parameter=logs'
          })
        }, 2000)
        return;
        // wx.login({
        //   success: function (resCode) {
        //     wx.getUserInfo({
        //       withCredentials: true,
        //       success: function (res_user) {
        //         wx.request({
        //           url: 'https://dev-shop-api.emaoapp.com/users/login',
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
        //             that.users();
        //           }
        //         })
        //       }
        //     })
        //   }
        // })
      } else {
        wx.showToast({
          title: '网络错误请稍后再试...',
          icon: 'none',
          mask: true
        })
      }
    },'hint')
  },
  // 免费领取会员卡
  freeoF: function () {
    wx.navigateTo({
      url: '../free/free'
    })
  },
  // 跳转我的店铺
  store: function (e) {
    wx.navigateTo({
      url: '/pages/user/store/store?shop_id=' + e.currentTarget.dataset.shop_id
    })
  },
  location:function(){
    wx.navigateTo({
      url: '/pages/location/location'
    })
  },
  sellorderMan: function () {
    wx.navigateTo({
      url: '/pages/sellorderMan/sellorderMan'
    })
  },
  order: function () {
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },
  setShop:function(){
    wx.navigateTo({
      url: '/pages/setShop/setShop'
    })
  },
  opinion:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.logs.advice_mobile  //仅为示例，并非真实的电话号码
    })
  },
  // 店铺
  shopST: function (e) {
    let ids = e.currentTarget.dataset.id;
    app.clearCart()
    // let name = e.currentTarget.dataset.name;
    // app.globalData.shopCart.merchantName = name;
    // app.globalData.shopCart.menu_list = [];
    // app.globalData.shopCart.total_fee = 0;
    // app.globalData.shopCart.shopNumber = 0;
    wx.navigateTo({
      url: '../Individual/Individual?id=' + ids
    })
  },
  onShow:function(){
   let that = this;
    if (wx.getStorageSync('token')) {
      console.log('users2');
      that.users(); //这儿再调用会 出现从“我的”到“授权登录”跳两次的现象
      // app.getRequest(users, {}, function (res) {
      //   if (res.data.code == 0) {
      //     wx.hideToast()
      //     that.setData({
      //       logs: res.data.res
      //     })

      //   } else if (res.data.code == -100) {
      //     wx.showToast({
      //       title: '用户登录过期,请重新获取信息授权!',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //     setTimeout(function () {
      //       wx.removeStorageSync('token')
      //       wx.navigateTo({
      //         url: '/pages/index/index?parameter=logs'
      //       })
      //     }, 2000)
      //   } else {
      //     wx.showToast({
      //       title: '网络错误请稍后再试...',
      //       icon: 'none',
      //       mask: true
      //     })
      //   }
      // }, 'hint')
    }
  }
})
