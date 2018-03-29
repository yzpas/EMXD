//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  // 免费领取会员卡
  freeoF: function () {
    wx.navigateTo({
      url: '../free/free'
    })
  },
  onLoad: function () {
    
  },
  // 跳转我的店铺
  store: function () {
    wx.navigateTo({
      url: '/pages/user/store/store'
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
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
})
